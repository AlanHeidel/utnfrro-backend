import { NotFoundError } from "@mikro-orm/core";
import { orm } from "../../shared/db/orm.js";
import { Mesa } from "../mesa/mesa.entity.js";
import { Notification, NotificationEstado } from "./notification.entity.js";

const em = orm.em;

export type NotificationDTO = {
  id: number;
  mesa: {
    id: number;
    numeroMesa: number | null;
  };
  estado: NotificationEstado;
  createdAt: Date;
};

type ListNotificationFilters = {
  estado?: NotificationEstado;
  mesaId?: number;
  limit?: number;
};

function toDTO(notification: Notification): NotificationDTO {
  return {
    id: notification.id,
    mesa: {
      id: notification.mesa.id,
      numeroMesa:
        "numeroMesa" in notification.mesa
          ? notification.mesa.numeroMesa ?? null
          : null,
    },
    estado: notification.estado,
    createdAt: notification.createdAt,
  };
}

export class NotificationService {
  async createMozoCallForMesa(mesaId: number) {
    const mesa = await em.findOneOrFail(Mesa, { id: mesaId, deleted: false });

    const existingPending = await em.findOne(
      Notification,
      {
        mesa: mesa.id,
        estado: NotificationEstado.PENDING,
      },
      { populate: ["mesa"] },
    );

    if (existingPending) {
      return {
        created: false,
        notification: toDTO(existingPending),
      };
    }

    const notification = em.create(Notification, {
      mesa,
      estado: NotificationEstado.PENDING,
      createdAt: new Date(),
    });

    await em.persistAndFlush(notification);

    const created = await em.findOneOrFail(
      Notification,
      { id: notification.id },
      { populate: ["mesa"] },
    );

    return {
      created: true,
      notification: toDTO(created),
    };
  }

  async list(filters: ListNotificationFilters = {}) {
    const where: Record<string, unknown> = {};

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.mesaId) {
      where.mesa = filters.mesaId;
    }

    const notifications = await em.find(Notification, where, {
      populate: ["mesa"],
      orderBy: { createdAt: "desc", id: "desc" },
      limit: filters.limit ?? 100,
    });

    return notifications.map(toDTO);
  }

  async updateEstado(id: number, estado: NotificationEstado) {
    const notification = await em.findOne(
      Notification,
      { id },
      { populate: ["mesa"] },
    );

    if (!notification) {
      throw new NotFoundError("notification not found");
    }

    notification.estado = estado;
    await em.flush();

    return toDTO(notification);
  }
}

export const notificationService = new NotificationService();
