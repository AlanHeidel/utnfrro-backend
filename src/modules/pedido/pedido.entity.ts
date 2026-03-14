import {
  Cascade,
  Collection,
  DateTimeType,
  Entity,
  Enum,
  OneToMany,
  ManyToOne,
  Property,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import { PedidoItem } from "./pedidoItem.entity.js";

export enum PedidoEstado {
  PENDING_PAYMENT = "pending_payment",
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

@Entity()
export class Pedido extends BaseEntity {
  @Property()
  fechaHora: Date = new Date();

  @ManyToOne(() => Mesa, { nullable: false })
  mesa!: Rel<Mesa>;

  @Enum(() => PedidoEstado)
  estado: PedidoEstado = PedidoEstado.PENDING;

  @Property()
  total!: number;

  @Property({ nullable: true, unique: true })
  paymentExternalReference?: string;

  @Property({ nullable: true })
  mpPreferenceId?: string;

  @Property({ nullable: true })
  mpPaymentId?: string;

  @Property({ nullable: true })
  mpPaymentStatus?: string;

  @Property({ type: DateTimeType, nullable: true })
  paidAt?: Date;

  @OneToMany(() => PedidoItem, (item: PedidoItem) => item.pedido, {
    cascade: [Cascade.ALL],
  })
  items = new Collection<PedidoItem>(this);

  setMesaOcupada() {
    if (this.mesa && "estado" in this.mesa) {
      this.mesa.estado = MesaEstado.OCUPADA;
    }
  }
}
