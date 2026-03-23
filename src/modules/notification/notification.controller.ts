import { NotFoundError } from "@mikro-orm/core";
import { Request, Response } from "express";
import { AnyTokenPayload } from "../auth/auth.utils.js";
import { emitMozoCallCreated, emitMozoCallUpdated } from "../../shared/socket/socket.js";
import { NotificationEstado } from "./notification.entity.js";
import { notificationService } from "./notification.service.js";

type AuthRequest = Request & { user?: AnyTokenPayload };

const NOTIFICATION_ESTADOS = new Set(Object.values(NotificationEstado));

function toNotificationEventPayload(notification: {
  id: number;
  mesa: { id: number; numeroMesa: number | null };
  estado: NotificationEstado;
  createdAt: Date;
}) {
  const mesaLabel = notification.mesa.numeroMesa ?? notification.mesa.id;
  return {
    id: notification.id,
    mesa: notification.mesa,
    estado: notification.estado,
    createdAt: notification.createdAt.toISOString(),
    message: `Mesa ${mesaLabel} solicita mozo`,
  };
}

export async function createMozoCallFromTableDevice(
  req: AuthRequest,
  res: Response,
) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const result = await notificationService.createMozoCallForMesa(mesaId);
    const payload = toNotificationEventPayload(result.notification);

    if (result.created) {
      emitMozoCallCreated(payload);
      return res.status(201).json({
        message: "mozo call created",
        data: result.notification,
      });
    }

    return res.status(200).json({
      message: "pending mozo call already exists",
      data: result.notification,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message ?? "unable to create mozo call" });
  }
}

export async function listNotifications(req: Request, res: Response) {
  try {
    const estadoRaw =
      typeof req.query.estado === "string" ? req.query.estado : undefined;
    const mesaIdRaw =
      typeof req.query.mesaId === "string"
        ? Number.parseInt(req.query.mesaId, 10)
        : undefined;
    const limitRaw =
      typeof req.query.limit === "string"
        ? Number.parseInt(req.query.limit, 10)
        : undefined;

    if (estadoRaw && !NOTIFICATION_ESTADOS.has(estadoRaw as NotificationEstado)) {
      return res.status(400).json({ message: "invalid estado" });
    }

    if (mesaIdRaw !== undefined && !Number.isInteger(mesaIdRaw)) {
      return res.status(400).json({ message: "mesaId must be a number" });
    }

    if (
      limitRaw !== undefined &&
      (!Number.isInteger(limitRaw) || limitRaw <= 0 || limitRaw > 500)
    ) {
      return res.status(400).json({ message: "limit must be between 1 and 500" });
    }

    const data = await notificationService.list({
      estado: estadoRaw as NotificationEstado | undefined,
      mesaId: mesaIdRaw,
      limit: limitRaw,
    });

    return res.status(200).json({ data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message ?? "unable to list notifications" });
  }
}

export async function updateNotificationEstado(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    const estado = req.body?.estado as NotificationEstado | undefined;
    if (!estado || !NOTIFICATION_ESTADOS.has(estado)) {
      return res.status(400).json({
        message: "estado is required and must be pending, attended or canceled",
      });
    }

    const data = await notificationService.updateEstado(id, estado);
    emitMozoCallUpdated(toNotificationEventPayload(data));

    return res.status(200).json({ message: "notification updated", data });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "notification not found" });
    }

    return res
      .status(400)
      .json({ message: error.message ?? "unable to update notification" });
  }
}
