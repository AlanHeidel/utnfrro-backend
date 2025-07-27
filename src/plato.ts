export class TipoPlato {
    idTipoPlato: string;
    nombre: string;

    constructor(idTipoPlato: string, nombre: string) {
        this.idTipoPlato = idTipoPlato;
        this.nombre = nombre;
    }
}

export class Plato {
    id: string;
    nombre: string;
    private precio: number;
    ingredientes: string[];
    tipoPlato: TipoPlato;
    imagen: string;

    constructor(id: string, nombre: string, precio: number, ingredientes: string[], tipoPlato: TipoPlato, imagen: string) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.ingredientes = ingredientes;
        this.tipoPlato = tipoPlato;
        this.imagen = imagen;
    }
}