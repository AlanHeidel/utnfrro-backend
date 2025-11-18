import { Entity, JsonType, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TipoPlato } from "../tipoPlato/tipoPlato.entity.js";

export enum PlatoEstado {
  DISPONIBLE = "disponible",
  DESTACADO = "destacado",
  AGOTADO = "agotado",
}

@Entity()
export class Plato extends BaseEntity {
  @Property()
  nombre!: string;

  @Property()
  precio!: number;

  @Property()
  costo!: number;

  @Property({ nullable: true })
  ingredientes?: string;

  @Property({ nullable: true })
  imagen?: string;

  @Property({ nullable: true })
  descrip?: string;

  @Property({ type: "string", default: PlatoEstado.DISPONIBLE })
  estado: PlatoEstado = PlatoEstado.DISPONIBLE;

  @ManyToOne(() => TipoPlato)
  tipoPlato!: TipoPlato;
}
