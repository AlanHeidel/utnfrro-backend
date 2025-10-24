import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";
import { Plato } from "../plato/plato.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

@Entity()
export class Pedido extends BaseEntity {
  @Property()
  fechaHora!: Date;

  @ManyToOne(() => Mesa, { nullable: false })
  mesa!: Rel<Mesa>;

  @ManyToOne(() => Cliente, { nullable: true })
  cliente?: Cliente;

  @ManyToMany(() => Plato)
  platos = new Collection<Plato>(this);
}
