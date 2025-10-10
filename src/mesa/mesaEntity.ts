export enum EstadoMesa {
  DISPONIBLE = "disponible",
  OCUPADA = "ocupada",
  RESERVADA = "reservada",
}

export class Mesa {
  private static contadorId = 0;

  id: string;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;

  constructor(numero: number, capacidad: number, estado: EstadoMesa = EstadoMesa.DISPONIBLE) {
    this.id = String(++Mesa.contadorId);
    this.numero = numero;
    this.capacidad = capacidad;
    this.estado = estado;
  }
}
