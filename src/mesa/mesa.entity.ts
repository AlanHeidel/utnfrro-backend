import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "../pedido/pedido.entity.js";
import { Mozo } from "../mozo/mozo.entity.js";

@Entity()
export class Mesa extends BaseEntity {
  @Property()
  numeroMesa!: number;
  @Property()
  capacidad!: number;
  @Property({ nullable: true })
  lugar?: string;

  @OneToMany(() => Pedido, (pedido: Pedido) => pedido.mesa)
  pedidos = new Collection<Rel<Pedido>>(this);

  @ManyToOne(() => Mozo)
  mozo!: Mozo;
}
