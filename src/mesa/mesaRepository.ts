import { Repository } from "../shared/repository.js";
import { Mesa, EstadoMesa } from "./mesaEntity.js";

const mesas = [
  new Mesa(1, 4, EstadoMesa.DISPONIBLE),
  new Mesa(2, 2, EstadoMesa.DISPONIBLE),
  new Mesa(3, 6, EstadoMesa.DISPONIBLE),
  new Mesa(4, 4, EstadoMesa.OCUPADA),
  new Mesa(5, 8, EstadoMesa.RESERVADA),
];

export class MesaRepository implements Repository<Mesa> {
  findAll(): Mesa[] | undefined {
    return mesas;
  }

  findOne(item: { id: string }): Mesa | undefined {
    return mesas.find((m) => m.id === item.id);
  }

  add(item: Mesa): Mesa | undefined {
    mesas.push(item);
    return item;
  }

  update(item: Mesa): Mesa | undefined {
    const mesaIdx = mesas.findIndex((m) => m.id === item.id);
    if (mesaIdx !== -1) {
      mesas[mesaIdx] = { ...mesas[mesaIdx], ...item };
    }
    return mesas[mesaIdx];
  }

  delete(item: { id: string }): Mesa | undefined {
    const mesaIdx = mesas.findIndex((m) => m.id === item.id);
    if (mesaIdx !== -1) {
      const deletedMesa = mesas[mesaIdx];
      mesas.splice(mesaIdx, 1);
      return deletedMesa;
    }
  }
}
