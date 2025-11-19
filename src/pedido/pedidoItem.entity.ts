import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pedido } from "./pedido.entity.js";
import { Plato } from "../plato/plato.entity.js";

@Entity()
export class PedidoItem extends BaseEntity {
  @ManyToOne(() => Pedido, { nullable: false })
  pedido!: Rel<Pedido>;

  @ManyToOne(() => Plato, { nullable: false })
  plato!: Rel<Plato>;

  @Property()
  cantidad!: number;

  @Property()
  precioUnitario!: number;
}
