import { Request, Response } from "express";
import {
  reservaService,
  CreateReservaInput,
  DisponibilidadQuery,
} from "./reserva.service.js";
import { AnyTokenPayload } from "../auth/auth.utils.js";
import { AccountRole } from "../account/account.entity.js";
import { NotFoundError } from "@mikro-orm/core";

type AuthRequest = Request & { user?: AnyTokenPayload };

function ensureAccountUser(req: AuthRequest, res: Response) {
  if (!req.user || req.user.kind !== "account") {
    res.status(403).json({ message: "forbidden" });
    return null;
  }
  return req.user;
}

export async function createReserva(req: AuthRequest, res: Response) {
  try {
    const user = ensureAccountUser(req, res);
    if (!user) return;

    const payload = req.body as Partial<CreateReservaInput>;
    if (!payload?.mesaId || !payload?.inicio) {
      return res
        .status(400)
        .json({ message: "mesaId and inicio are required" });
    }

    const reserva = await reservaService.create(user.sub, {
      mesaId: Number(payload.mesaId),
      inicio: payload.inicio,
      observacion: payload.observacion,
    });

    res.status(201).json({ message: "reserva created", data: reserva });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message ?? "unable to create reserva" });
  }
}

export async function disponibilidadReservas(req: Request, res: Response) {
  try {
    const query = req.query as Partial<DisponibilidadQuery>;
    if (!query?.fecha || !query?.personas) {
      return res
        .status(400)
        .json({ message: "fecha and personas are required query params" });
    }

    const data = await reservaService.disponibilidad({
      fecha: String(query.fecha),
      personas: Number(query.personas),
    });

    res.status(200).json({ data });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message ?? "unable to compute disponibilidad" });
  }
}

export async function findAllReservas(req: AuthRequest, res: Response) {
  try {
    const user = ensureAccountUser(req, res);
    if (!user) return;

    if (user.role === AccountRole.ADMIN) {
      const reservas = await reservaService.list();
      return res.status(200).json({ data: reservas });
    }

    const reservas = await reservaService.listForAccount(user.sub);
    return res.status(200).json({ data: reservas });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message ?? "unable to list reservas" });
  }
}

export async function findOneReserva(req: AuthRequest, res: Response) {
  try {
    const user = ensureAccountUser(req, res);
    if (!user) return;

    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    const reserva = await reservaService.findOne(id);
    if (user.role !== AccountRole.ADMIN && reserva.account.id !== user.sub) {
      return res.status(403).json({ message: "forbidden" });
    }

    res.status(200).json({ data: reserva });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "reserva not found" });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to find reserva" });
  }
}

export async function cancelReserva(req: AuthRequest, res: Response) {
  try {
    const user = ensureAccountUser(req, res);
    if (!user) return;

    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    const reserva = await reservaService.cancel(
      id,
      user.sub,
      user.role === AccountRole.ADMIN,
    );
    res.status(200).json({ message: "reserva canceled", data: reserva });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "reserva not found" });
    }
    if (error.message === "forbidden") {
      return res.status(403).json({ message: "forbidden" });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to cancel reserva" });
  }
}

export async function finalizeReserva(req: AuthRequest, res: Response) {
  try {
    const user = ensureAccountUser(req, res);
    if (!user) return;

    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    const reserva = await reservaService.finalize(
      id,
      user.role === AccountRole.ADMIN,
    );
    res.status(200).json({ message: "reserva finalized", data: reserva });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "reserva not found" });
    }
    if (error.message === "forbidden") {
      return res.status(403).json({ message: "forbidden" });
    }
    if (error.message === "canceled reserva cannot be finalized") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to finalize reserva" });
  }
}
