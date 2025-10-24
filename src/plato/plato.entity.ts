import { Entity, JsonType, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TipoPlato } from "../tipoPlato/tipoPlato.entity.js";

@Entity()
export class Plato extends BaseEntity {
  @Property()
  nombre!: string;
  @Property()
  precio!: number;
  @Property({ nullable: true })
  ingredientes?: string;
  @Property({ nullable: true })
  imagen?: string;

  @ManyToOne(() => TipoPlato)
  tipoPlato!: TipoPlato;
}
