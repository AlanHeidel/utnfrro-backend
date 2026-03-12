import { orm } from "../shared/db/orm.js";
import { Pedido, PedidoEstado } from "./pedido.entity.js";
import { PedidoItem } from "./pedidoItem.entity.js";
import { Plato } from "../plato/plato.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import { wrap } from "@mikro-orm/core";

const em = orm.em;
const PENDING_EXPIRATION_HOURS = 3;
const EXPIRES_TO_CANCELED_STATES = [
  PedidoEstado.PENDING,
  PedidoEstado.PENDING_PAYMENT,
];
const ACTIVE_PEDIDO_STATES = [PedidoEstado.PENDING, PedidoEstado.IN_PROGRESS];

export interface PedidoItemInput {
  platoId: number;
  cantidad: number;
}

export interface CreatePedidoInput {
  items: PedidoItemInput[];
  nota?: string;
}

export class PedidoService {
  private async syncMesaEstadoByPedidos(mesaId: number) {
    const mesa = await em.findOne(Mesa, { id: mesaId, deleted: false });
    if (!mesa) return;

    const activePedidosCount = await em.count(Pedido, {
      mesa: mesaId,
      estado: { $in: ACTIVE_PEDIDO_STATES },
    });

    if (activePedidosCount > 0) {
      if (mesa.estado !== MesaEstado.OCUPADA) {
        mesa.estado = MesaEstado.OCUPADA;
        await em.flush();
      }
      return;
    }

    if (mesa.estado !== MesaEstado.DISPONIBLE) {
      mesa.estado = MesaEstado.DISPONIBLE;
      await em.flush();
    }
  }

  private async expireOldPendingPedidos() {
    const threshold = new Date(
      Date.now() - PENDING_EXPIRATION_HOURS * 60 * 60 * 1000
    );
    const expiredPedidos = await em.find(
      Pedido,
      {
        estado: { $in: EXPIRES_TO_CANCELED_STATES },
        fechaHora: { $lte: threshold },
      },
      { populate: ["mesa"] }
    );

    if (!expiredPedidos.length) return;

    const affectedMesaIds = new Set<number>();

    for (const pedido of expiredPedidos) {
      pedido.estado = PedidoEstado.CANCELED;
      affectedMesaIds.add(pedido.mesa.id);
    }

    await em.flush();

    for (const mesaId of affectedMesaIds) {
      await this.syncMesaEstadoByPedidos(mesaId);
    }
  }

  async createFromTableDevice(mesaId: number, input: CreatePedidoInput) {
    await this.expireOldPendingPedidos();

    if (!input.items?.length) {
      throw new Error("items is required");
    }

    const normalizedItems = input.items.map((i) => ({
      platoId: Number(i.platoId),
      cantidad: Number(i.cantidad),
    }));

    normalizedItems.forEach((item) => {
      if (!Number.isInteger(item.platoId) || item.platoId <= 0) {
        throw new Error("platoId must be a positive integer");
      }
      if (!Number.isFinite(item.cantidad) || item.cantidad <= 0) {
        throw new Error("cantidad must be greater than 0");
      }
    });

    const platoIds = normalizedItems.map((i) => i.platoId);

    return em.fork().transactional(async (tem) => {
      const mesa = await tem.findOneOrFail(Mesa, { id: mesaId });
      const platos = await tem.find(Plato, { id: { $in: platoIds } });

      if (platos.length !== normalizedItems.length) {
        throw new Error("Some platos were not found");
      }

      const pedido = tem.create(Pedido, {
        mesa,
        estado: PedidoEstado.PENDING,
        total: 0,
        fechaHora: new Date(),
      });

      let total = 0;
      normalizedItems.forEach((item) => {
        const plato = platos.find((p) => p.id === item.platoId)!;
        const precioUnitario = plato.precio;
        total += precioUnitario * item.cantidad;

        const pedidoItem = tem.create(PedidoItem, {
          pedido,
          plato,
          cantidad: item.cantidad,
          precioUnitario,
        });

        pedido.items.add(pedidoItem);
      });

      pedido.total = total;
      pedido.setMesaOcupada();
      wrap(mesa).assign({ estado: MesaEstado.OCUPADA });

      await tem.persistAndFlush(pedido);
      return pedido;
    });
  }

  async list() {
    await this.expireOldPendingPedidos();
    const pedidos = await em.find(
      Pedido,
      {},
      { populate: ["mesa", "mesa.mozo", "items.plato"] }
    );
    return pedidos;
  }

  async findOne(id: number) {
    await this.expireOldPendingPedidos();
    return em.findOneOrFail(
      Pedido,
      { id },
      { populate: ["mesa", "items.plato"] }
    );
  }

  async updateEstado(id: number, estado: PedidoEstado) {
    await this.expireOldPendingPedidos();
    const pedido = await em.findOneOrFail(Pedido, { id }, { populate: ["mesa"] });
    pedido.estado = estado;
    await em.flush();
    await this.syncMesaEstadoByPedidos(pedido.mesa.id);
    return pedido;
  }

  private async findForMesaByEstados(
    mesaId: number,
    estados: PedidoEstado[],
    notFoundMessage: string
  ) {
    await this.expireOldPendingPedidos();

    const pedidos = await em.find(
      Pedido,
      {
        mesa: { id: mesaId },
        estado: { $in: estados },
      },
      {
        populate: ["mesa", "items.plato"],
        orderBy: { fechaHora: "desc", id: "desc" },
      }
    );

    if (!pedidos.length) {
      throw new Error(notFoundMessage);
    }

    return pedidos;
  }

  async findPendingForMesa(mesaId: number) {
    return this.findForMesaByEstados(
      mesaId,
      [PedidoEstado.PENDING],
      "no pending pedido for mesa"
    );
  }

  async findInProgressForMesa(mesaId: number) {
    return this.findForMesaByEstados(
      mesaId,
      [PedidoEstado.IN_PROGRESS],
      "no in-progress pedido for mesa"
    );
  }

  async findPendingPaymentForMesa(mesaId: number) {
    return this.findForMesaByEstados(
      mesaId,
      [PedidoEstado.PENDING_PAYMENT],
      "no pending-payment pedido for mesa"
    );
  }
}

export const pedidoService = new PedidoService();
