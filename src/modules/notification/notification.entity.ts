import {
  DateTimeType,
  Entity,
  Enum,
  ManyToOne,
  Property,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";

export enum NotificationEstado {
  PENDING = "pending",
  ATTENDED = "attended",
  CANCELED = "canceled",
}

@Entity()
export class Notification extends BaseEntity {
  @ManyToOne(() => Mesa, { nullable: false })
  mesa!: Rel<Mesa>;

  @Enum(() => NotificationEstado)
  estado: NotificationEstado = NotificationEstado.PENDING;

  @Property({ type: DateTimeType })
  createdAt: Date = new Date();
}
