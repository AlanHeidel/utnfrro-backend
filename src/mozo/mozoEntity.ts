export class Mozo {
  private static contadorId = 0;

  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;

  constructor(
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    dni: string
  ) {
    this.id = String(++Mozo.contadorId);
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.dni = dni;
  }
}
