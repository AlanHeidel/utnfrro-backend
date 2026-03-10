import { orm } from "../shared/db/orm.js";
import { Reserva, ReservaEstado } from "./reserva.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import { Account, AccountRole } from "../account/account.entity.js";
import {
  RESERVA_CLOSE_HOUR,
  RESERVA_DURATION_HOURS,
  RESERVA_OPEN_HOUR,
  RESERVA_SLOT_MINUTES,
} from "../config.js";

const em = orm.em;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

export interface CreateReservaInput {
  mesaId: number;
  inicio: string | Date;
  observacion?: string;
}

export interface DisponibilidadQuery {
  fecha: string;
  personas: number;
}

export interface SlotDisponibilidad {
  inicio: string;
  fin: string;
  mesasDisponibles: Array<{ id: number; numeroMesa: number; capacidad: number }>;
  cantidadMesasDisponibles: number;
}

export class ReservaService {
  async syncMesaEstadosPorReservas() {
    await this.finalizeExpiredActivas();

    const now = new Date();
    const reservasEnCurso = await em.find(
      Reserva,
      {
        estado: ReservaEstado.ACTIVA,
        inicio: { $lte: now },
        fin: { $gt: now },
      },
      { populate: ["mesa"] }
    );

    const mesaIdsConReservaActiva = new Set(
      reservasEnCurso.map((r) => r.mesa.id)
    );

    let changed = false;

    const mesasMarcadasReservadas = await em.find(Mesa, {
      deleted: false,
      estado: MesaEstado.RESERVADA,
    });

    for (const mesa of mesasMarcadasReservadas) {
      if (!mesaIdsConReservaActiva.has(mesa.id)) {
        mesa.estado = MesaEstado.DISPONIBLE;
        changed = true;
      }
    }

    if (mesaIdsConReservaActiva.size > 0) {
      const mesasConReservaActiva = await em.find(Mesa, {
        id: { $in: [...mesaIdsConReservaActiva] },
        deleted: false,
      });

      for (const mesa of mesasConReservaActiva) {
        if (mesa.estado === MesaEstado.DISPONIBLE) {
          mesa.estado = MesaEstado.RESERVADA;
          changed = true;
        }
      }
    }

    if (changed) {
      await em.flush();
    }
  }

  async finalizeExpiredActivas() {
    const now = new Date();
    await em.nativeUpdate(
      Reserva,
      {
        estado: ReservaEstado.ACTIVA,
        fin: { $lte: now },
      },
      { estado: ReservaEstado.FINALIZADA }
    );
  }

  private formatLocalIso(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absOffset = Math.abs(offsetMinutes);
    const offsetHour = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const offsetMinute = String(absOffset % 60).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
  }

  private parseInicio(value: string | Date) {
    const inicio = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(inicio.getTime())) {
      throw new Error("inicio must be a valid date");
    }

    const minutes = inicio.getMinutes();
    const seconds = inicio.getSeconds();
    const millis = inicio.getMilliseconds();
    if (minutes % RESERVA_SLOT_MINUTES !== 0 || seconds !== 0 || millis !== 0) {
      throw new Error(`inicio must be aligned to ${RESERVA_SLOT_MINUTES}-minute slots`);
    }

    return inicio;
  }

  private calculateFin(inicio: Date) {
    return new Date(inicio.getTime() + RESERVA_DURATION_HOURS * ONE_HOUR_MS);
  }

  private getNextSlotFrom(date: Date) {
    const slotMinutes = RESERVA_SLOT_MINUTES;
    const hasSubMinute = date.getSeconds() !== 0 || date.getMilliseconds() !== 0;
    const minuteRemainder = date.getMinutes() % slotMinutes;
    const minutesToAdd =
      minuteRemainder === 0
        ? (hasSubMinute ? slotMinutes : 0)
        : slotMinutes - minuteRemainder;

    const next = new Date(date);
    next.setSeconds(0, 0);
    next.setMinutes(next.getMinutes() + minutesToAdd);
    return next;
  }

  private getWindowForFecha(fecha: { year: number; month: number; day: number }) {
    const rangeStart = new Date(fecha.year, fecha.month, fecha.day, RESERVA_OPEN_HOUR, 0, 0, 0);
    const lastStart =
      RESERVA_CLOSE_HOUR === 0
        ? new Date(fecha.year, fecha.month, fecha.day + 1, 0, 0, 0, 0)
        : new Date(fecha.year, fecha.month, fecha.day, RESERVA_CLOSE_HOUR, 0, 0, 0);

    return { rangeStart, lastStart };
  }

  private isStartAllowed(inicio: Date) {
    const minutes = inicio.getHours() * 60 + inicio.getMinutes();
    const openMinutes = RESERVA_OPEN_HOUR * 60;
    const closeMinutes = RESERVA_CLOSE_HOUR * 60;

    // ventana nocturna (ej: 20:00 a 00:00)
    if (RESERVA_CLOSE_HOUR <= RESERVA_OPEN_HOUR) {
      return minutes >= openMinutes || minutes <= closeMinutes;
    }

    // ventana diurna normal
    return minutes >= openMinutes && minutes <= closeMinutes;
  }

  private parseFechaLocal(fecha: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
    if (!match) {
      throw new Error("fecha must have format YYYY-MM-DD");
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);

    return { year, month, day };
  }

  async create(accountId: number, input: CreateReservaInput) {
    await this.syncMesaEstadosPorReservas();

    const mesaId = Number(input.mesaId);
    if (!Number.isInteger(mesaId) || mesaId <= 0) {
      throw new Error("mesaId must be a positive integer");
    }

    const inicio = this.parseInicio(input.inicio);
    const fin = this.calculateFin(inicio);
    const minAllowedStart = this.getNextSlotFrom(new Date());
    if (inicio < minAllowedStart) {
      throw new Error("inicio must be in the future");
    }
    if (!this.isStartAllowed(inicio)) {
      throw new Error(
        `inicio must be within reservation window (${RESERVA_OPEN_HOUR}:00 to ${
          RESERVA_CLOSE_HOUR === 0 ? "00" : RESERVA_CLOSE_HOUR
        }:00)`
      );
    }

    const account = await em.findOneOrFail(Account, { id: accountId });
    if (![AccountRole.CLIENTE, AccountRole.ADMIN].includes(account.role)) {
      throw new Error("only account users can create reservas");
    }

    const mesa = await em.findOneOrFail(Mesa, { id: mesaId, deleted: false });

    const overlapping = await em.findOne(Reserva, {
      mesa,
      estado: ReservaEstado.ACTIVA,
      inicio: { $lt: fin },
      fin: { $gt: inicio },
    });

    if (overlapping) {
      throw new Error("mesa already reserved in the selected time slot");
    }

    const reserva = em.create(Reserva, {
      mesa,
      account,
      inicio,
      fin,
      observacion: input.observacion,
      estado: ReservaEstado.ACTIVA,
    });

    await em.persistAndFlush(reserva);
    await this.syncMesaEstadosPorReservas();
    return em.findOneOrFail(
      Reserva,
      { id: reserva.id },
      { populate: ["mesa", "account"] }
    );
  }

  async list() {
    await this.syncMesaEstadosPorReservas();
    return em.find(
      Reserva,
      {},
      { populate: ["mesa", "account"], orderBy: { inicio: "asc" } }
    );
  }

  async findOne(id: number) {
    await this.syncMesaEstadosPorReservas();
    return em.findOneOrFail(
      Reserva,
      { id },
      { populate: ["mesa", "account"] }
    );
  }

  async listForAccount(accountId: number) {
    await this.syncMesaEstadosPorReservas();
    return em.find(
      Reserva,
      { account: accountId },
      { populate: ["mesa"], orderBy: { inicio: "asc" } }
    );
  }

  async cancel(id: number, accountId?: number, isAdmin?: boolean) {
    await this.syncMesaEstadosPorReservas();
    const reserva = await em.findOneOrFail(Reserva, { id }, { populate: ["account"] });

    if (!isAdmin && accountId && reserva.account.id !== accountId) {
      throw new Error("forbidden");
    }

    reserva.estado = ReservaEstado.CANCELADA;
    await em.flush();
    await this.syncMesaEstadosPorReservas();
    return reserva;
  }

  async finalize(id: number, isAdmin?: boolean) {
    await this.syncMesaEstadosPorReservas();
    const reserva = await em.findOneOrFail(
      Reserva,
      { id },
      { populate: ["mesa", "account"] }
    );

    if (!isAdmin) {
      throw new Error("forbidden");
    }

    if (reserva.estado === ReservaEstado.CANCELADA) {
      throw new Error("canceled reserva cannot be finalized");
    }

    if (reserva.estado !== ReservaEstado.FINALIZADA) {
      reserva.estado = ReservaEstado.FINALIZADA;
      await em.flush();
      await this.syncMesaEstadosPorReservas();
    }

    return reserva;
  }

  async disponibilidad(query: DisponibilidadQuery) {
    await this.syncMesaEstadosPorReservas();

    const personas = Number(query.personas);
    if (!Number.isInteger(personas) || personas <= 0) {
      throw new Error("personas must be a positive integer");
    }

    const fecha = this.parseFechaLocal(query.fecha);

    const mesas = await em.find(
      Mesa,
      { deleted: false, capacidad: { $gte: personas } },
      { orderBy: { numeroMesa: "asc" } }
    );
    const mesaIds = mesas.map((m) => m.id);

    if (!mesas.length) {
      return {
        fecha: query.fecha,
        personas,
        slotMinutes: RESERVA_SLOT_MINUTES,
        durationHours: RESERVA_DURATION_HOURS,
        slots: [] as SlotDisponibilidad[],
      };
    }

    const { rangeStart, lastStart } = this.getWindowForFecha(fecha);
    const rangeEnd = new Date(
      lastStart.getTime() + RESERVA_DURATION_HOURS * ONE_HOUR_MS
    );

    const reservasActivas = await em.find(Reserva, {
      estado: ReservaEstado.ACTIVA,
      mesa: { id: { $in: mesaIds } },
      inicio: { $lt: rangeEnd },
      fin: { $gt: rangeStart },
    }, { populate: ["mesa"] });

    const slots: SlotDisponibilidad[] = [];
    const earliestSlotAllowed = this.getNextSlotFrom(new Date());
    const firstCursor =
      rangeStart > earliestSlotAllowed ? rangeStart : earliestSlotAllowed;

    if (firstCursor > lastStart) {
      return {
        fecha: query.fecha,
        personas,
        window: {
          from: `${String(RESERVA_OPEN_HOUR).padStart(2, "0")}:00`,
          to: `${String(RESERVA_CLOSE_HOUR).padStart(2, "0")}:00`,
        },
        slotMinutes: RESERVA_SLOT_MINUTES,
        durationHours: RESERVA_DURATION_HOURS,
        slots,
      };
    }

    for (
      let cursor = new Date(firstCursor);
      cursor <= lastStart;
      cursor = new Date(cursor.getTime() + RESERVA_SLOT_MINUTES * ONE_MINUTE_MS)
    ) {
      const slotInicio = new Date(cursor);
      const slotFin = this.calculateFin(slotInicio);

      const mesasOcupadas = new Set(
        reservasActivas
          .filter((r) => r.inicio < slotFin && r.fin > slotInicio)
          .map((r) => r.mesa.id)
      );

      const mesasDisponibles = mesas
        .filter((m) => !mesasOcupadas.has(m.id))
        .map((m) => ({
          id: m.id,
          numeroMesa: m.numeroMesa,
          capacidad: m.capacidad,
        }));

      if (mesasDisponibles.length > 0) {
        slots.push({
          inicio: this.formatLocalIso(slotInicio),
          fin: this.formatLocalIso(slotFin),
          mesasDisponibles,
          cantidadMesasDisponibles: mesasDisponibles.length,
        });
      }
    }

    return {
      fecha: query.fecha,
      personas,
      window: {
        from: `${String(RESERVA_OPEN_HOUR).padStart(2, "0")}:00`,
        to: `${String(RESERVA_CLOSE_HOUR).padStart(2, "0")}:00`,
      },
      slotMinutes: RESERVA_SLOT_MINUTES,
      durationHours: RESERVA_DURATION_HOURS,
      slots,
    };
  }
}

export const reservaService = new ReservaService();
