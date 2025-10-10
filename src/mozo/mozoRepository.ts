import { Repository } from "../shared/repository.js";
import { Mozo } from "./mozoEntity.js";

const mozos = [
  new Mozo(
    "Roberto",
    "Fernández",
    "3517777777",
    "roberto.fernandez@restaurante.com",
    "33445566"
  ),
  new Mozo(
    "Laura",
    "Sánchez",
    "3518888888",
    "laura.sanchez@restaurante.com",
    "44556677"
  ),
  new Mozo(
    "Diego",
    "López",
    "3516666666",
    "diego.lopez@restaurante.com",
    "55667788"
  ),
];

export class MozoRepository implements Repository<Mozo> {
  findAll(): Mozo[] | undefined {
    return mozos;
  }

  findOne(item: { id: string }): Mozo | undefined {
    return mozos.find((m) => m.id === item.id);
  }

  add(item: Mozo): Mozo | undefined {
    mozos.push(item);
    return item;
  }

  update(item: Mozo): Mozo | undefined {
    const mozoIdx = mozos.findIndex((m) => m.id === item.id);
    if (mozoIdx !== -1) {
      mozos[mozoIdx] = { ...mozos[mozoIdx], ...item };
    }
    return mozos[mozoIdx];
  }

  delete(item: { id: string }): Mozo | undefined {
    const mozoIdx = mozos.findIndex((m) => m.id === item.id);
    if (mozoIdx !== -1) {
      const deletedMozo = mozos[mozoIdx];
      mozos.splice(mozoIdx, 1);
      return deletedMozo;
    }
  }
}
