import { orm } from "../shared/db/orm.js";
import { Pedido, PedidoEstado } from "./pedido.entity.js";
import { PedidoItem } from "./pedidoItem.entity.js";
import { Plato } from "../plato/plato.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import { wrap } from "@mikro-orm/core";

const em = orm.em;

export interface PedidoItemInput {
  platoId: number;
  cantidad: number;
}

export interface CreatePedidoInput {
  items: PedidoItemInput[];
  nota?: string;
}

export class PedidoService {
  async createFromTableDevice(mesaId: number, input: CreatePedidoInput) {
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
    const pedidos = await em.find(
      Pedido,
      {},
      { populate: ["mesa", "mesa.mozo", "items.plato"] }
    );
    return pedidos;
  }

  async findOne(id: number) {
    return em.findOneOrFail(
      Pedido,
      { id },
      { populate: ["mesa", "items.plato"] }
    );
  }

  async updateEstado(id: number, estado: PedidoEstado) {
    const pedido = await em.findOneOrFail(Pedido, { id });
    pedido.estado = estado;
    await em.flush();
    return pedido;
  }

  async findOneForMesa(id: number, mesaId: number) {
    const pedido = await em.findOneOrFail(
      Pedido,
      { id },
      { populate: ["mesa", "items.plato"] }
    );
    if (pedido.mesa.id !== mesaId) {
      throw new Error("forbidden");
    }
    return pedido;
  }
}

export const pedidoService = new PedidoService();
