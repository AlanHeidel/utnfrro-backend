export class TipoPlato {
  idTipoPlato: string;
  nombre: string;

  constructor(idTipoPlato: string, nombre: string) {
    this.idTipoPlato = idTipoPlato;
    this.nombre = nombre;
  }
}

export class Plato {
  private static contadorId = 0;

  id: string;
  nombre: string;
  precio: number;
  ingredientes: string[];
  tipoPlato: TipoPlato;
  imagen: string;

  constructor(
    nombre: string,
    precio: number,
    ingredientes: string[],
    tipoPlato: TipoPlato,
    imagen: string
  ) {
    this.id = String(++Plato.contadorId);
    this.nombre = nombre;
    this.precio = precio;
    this.ingredientes = ingredientes;
    this.tipoPlato = tipoPlato;
    this.imagen = imagen;
  }
}
