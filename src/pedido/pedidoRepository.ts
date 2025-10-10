import { Repository } from "../shared/repository.js";
import { Pedido, EstadoPedido, ItemPedido } from "./pedidoEntity.js";
import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa, EstadoMesa } from "../mesa/mesaEntity.js";
import { Mozo } from "../mozo/mozoEntity.js";
import { Plato, TipoPlato } from "../plato/platoEntity.js";

// Datos de ejemplo para pedidos
const clienteEjemplo = new Cliente(
  "Carlos",
  "Martínez",
  "3515555555",
  "carlos.martinez@email.com",
  "11223344"
);
const mesaEjemplo = new Mesa(1, 4, EstadoMesa.OCUPADA);
const mozoEjemplo = new Mozo(
  "Roberto",
  "Fernández",
  "3517777777",
  "roberto.fernandez@restaurante.com",
  "33445566"
);
const tipoPlatoEjemplo = new TipoPlato("2", "Plato Principal");
const platoEjemplo1 = new Plato(
  "Milanesa a la napolitana",
  1500,
  ["milanesa", "queso"],
  tipoPlatoEjemplo,
  "https://example.com/milanesa.jpg"
);
const platoEjemplo2 = new Plato(
  "Ensalada Caesar",
  1200,
  ["lechuga", "pollo"],
  tipoPlatoEjemplo,
  "https://example.com/ensalada.jpg"
);

const itemsEjemplo: ItemPedido[] = [
  {
    plato: platoEjemplo1,
    cantidad: 2,
    subtotal: 3000,
  },
  {
    plato: platoEjemplo2,
    cantidad: 1,
    subtotal: 1200,
  },
];

const pedidos = [
  new Pedido(
    mesaEjemplo,
    clienteEjemplo,
    mozoEjemplo,
    itemsEjemplo,
    EstadoPedido.EN_PREPARACION
  ),
];

export class PedidoRepository implements Repository<Pedido> {
  findAll(): Pedido[] | undefined {
    return pedidos;
  }

  findOne(item: { id: string }): Pedido | undefined {
    return pedidos.find((p) => p.id === item.id);
  }

  add(item: Pedido): Pedido | undefined {
    pedidos.push(item);
    return item;
  }

  update(item: Pedido): Pedido | undefined {
    const pedidoIdx = pedidos.findIndex((p) => p.id === item.id);
    if (pedidoIdx !== -1) {
      // Actualizar solo las propiedades que vienen en item
      if (item.mesa !== undefined) pedidos[pedidoIdx].mesa = item.mesa;
      if (item.cliente !== undefined) pedidos[pedidoIdx].cliente = item.cliente;
      if (item.mozo !== undefined) pedidos[pedidoIdx].mozo = item.mozo;
      if (item.items !== undefined) pedidos[pedidoIdx].items = item.items;
      if (item.estado !== undefined) pedidos[pedidoIdx].estado = item.estado;
      
      // Recalcular el total si los items cambiaron
      if (item.items !== undefined) {
        pedidos[pedidoIdx].actualizarTotal();
      }
    }
    return pedidos[pedidoIdx];
  }

  delete(item: { id: string }): Pedido | undefined {
    const pedidoIdx = pedidos.findIndex((p) => p.id === item.id);
    if (pedidoIdx !== -1) {
      const deletedPedido = pedidos[pedidoIdx];
      pedidos.splice(pedidoIdx, 1);
      return deletedPedido;
    }
  }
}
