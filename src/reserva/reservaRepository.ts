import { Repository } from "../shared/repository.js";
import { Reserva, EstadoReserva } from "./reservaEntity.js";
import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa, EstadoMesa } from "../mesa/mesaEntity.js";

// Datos de ejemplo para reservas
const clienteEjemplo1 = new Cliente(
  "Ana",
  "Torres",
  "3514444444",
  "ana.torres@email.com",
  "99887766"
);
const mesaEjemplo1 = new Mesa(5, 4, EstadoMesa.RESERVADA);

const reservas = [
  new Reserva(
    clienteEjemplo1,
    mesaEjemplo1,
    "2024-12-25",
    "20:00",
    4,
    EstadoReserva.CONFIRMADA
  ),
];

export class ReservaRepository implements Repository<Reserva> {
  findAll(): Reserva[] | undefined {
    return reservas;
  }

  findOne(item: { id: string }): Reserva | undefined {
    return reservas.find((r) => r.id === item.id);
  }

  add(item: Reserva): Reserva | undefined {
    reservas.push(item);
    return item;
  }

  update(item: Reserva): Reserva | undefined {
    const reservaIdx = reservas.findIndex((r) => r.id === item.id);
    if (reservaIdx !== -1) {
      reservas[reservaIdx] = { ...reservas[reservaIdx], ...item };
    }
    return reservas[reservaIdx];
  }

  delete(item: { id: string }): Reserva | undefined {
    const reservaIdx = reservas.findIndex((r) => r.id === item.id);
    if (reservaIdx !== -1) {
      const deletedReserva = reservas[reservaIdx];
      reservas.splice(reservaIdx, 1);
      return deletedReserva;
    }
  }
}
