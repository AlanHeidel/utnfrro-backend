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
import { Account } from "../account/account.entity.js";

export enum ReservaEstado {
  ACTIVA = "activa",
  CANCELADA = "cancelada",
  FINALIZADA = "finalizada",
}

@Entity()
export class Reserva extends BaseEntity {
  @Property({ type: DateTimeType })
  inicio!: Date;

  @Property({ type: DateTimeType })
  fin!: Date;

  @Enum(() => ReservaEstado)
  estado: ReservaEstado = ReservaEstado.ACTIVA;

  @Property({ nullable: true })
  observacion?: string;

  @ManyToOne(() => Mesa, { nullable: false })
  mesa!: Rel<Mesa>;

  @ManyToOne(() => Account, { nullable: false })
  account!: Rel<Account>;
}
