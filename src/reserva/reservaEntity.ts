import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa } from "../mesa/mesaEntity.js";

export enum EstadoReserva {
  PENDIENTE = "pendiente",
  CONFIRMADA = "confirmada",
  CANCELADA = "cancelada",
  COMPLETADA = "completada",
}

export class Reserva {
  private static contadorId = 0;

  id: string;
  cliente: Cliente;
  mesa: Mesa;
  fecha: string; // formato: YYYY-MM-DD
  hora: string; // formato: HH:MM
  cantidadPersonas: number;
  estado: EstadoReserva;

  constructor(
    cliente: Cliente,
    mesa: Mesa,
    fecha: string,
    hora: string,
    cantidadPersonas: number,
    estado: EstadoReserva = EstadoReserva.PENDIENTE
  ) {
    this.id = String(++Reserva.contadorId);
    this.cliente = cliente;
    this.mesa = mesa;
    this.fecha = fecha;
    this.hora = hora;
    this.cantidadPersonas = cantidadPersonas;
    this.estado = estado;
  }
}
