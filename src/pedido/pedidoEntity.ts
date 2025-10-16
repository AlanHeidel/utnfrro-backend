import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa } from "../mesa/mesaEntity.js";
import { Mozo } from "../mozo/mozoEntity.js";
import { Plato } from "../plato/platoEntity.js";

export enum EstadoPedido {
  PENDIENTE = "pendiente",
  EN_PREPARACION = "en_preparacion",
  LISTO = "listo",
  ENTREGADO = "entregado",
  CANCELADO = "cancelado",
}

export interface ItemPedido {
  plato: Plato;
  cantidad: number;
  subtotal: number;
}

export class Pedido {
  private static contadorId = 0;

  id: string;
  mesa: Mesa;
  cliente: Cliente;
  mozo: Mozo;
  items: ItemPedido[];
  fecha: string; // formato: YYYY-MM-DD HH:MM:SS
  estado: EstadoPedido;
  total: number;

  constructor(
    mesa: Mesa,
    cliente: Cliente,
    mozo: Mozo,
    items: ItemPedido[],
    estado: EstadoPedido = EstadoPedido.PENDIENTE
  ) {
    this.id = String(++Pedido.contadorId);
    this.mesa = mesa;
    this.cliente = cliente;
    this.mozo = mozo;
    this.items = items;
    this.fecha = new Date().toISOString();
    this.estado = estado;
    this.total = this.calcularTotal();
  }

  private calcularTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  actualizarTotal(): void {
    this.total = this.calcularTotal();
  }
}
