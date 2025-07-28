import { Repository } from "../shared/repository.js";
import { Plato, TipoPlato } from "./platoEntity.js";

const tiposPlatos = [
  new TipoPlato("1", "Entrada"),
  new TipoPlato("2", "Plato Principal"),
  new TipoPlato("3", "Postre"),
  new TipoPlato("4", "Bebida"),
];

const platos = [
  new Plato(
    "Milanesa a la napolitana",
    1500,
    ["milanesa", "queso"],
    tiposPlatos[2],
    "https://example.com/milanesa.jpg"
  ),
  new Plato(
    "Ensalada Caesar",
    1200,
    ["lechuga", "pollo"],
    tiposPlatos[1],
    "https://example.com/ensalada.jpg"
  ),
];

export class PlatoRepository implements Repository<Plato> {
  findAll(): Plato[] | undefined {
    return platos;
  }

  findOne(item: { id: string }): Plato | undefined {
    return platos.find((p) => p.id === item.id);
  }

  add(item: Plato): Plato | undefined {
    platos.push(item);
    return item;
  }

  update(item: Plato): Plato | undefined {
    const platoIdx = platos.findIndex((p) => p.id === item.id);
    if (platoIdx !== -1) {
      platos[platoIdx] = { ...platos[platoIdx], ...item };
    }
    return platos[platoIdx];
  }

  delete(item: { id: string }): Plato | undefined {
    const platoIdx = platos.findIndex((p) => p.id === item.id);
    if (platoIdx !== -1) {
      const deletedPlato = platos[platoIdx];
      platos.splice(platoIdx, 1);
      return deletedPlato;
    }
  }
}
