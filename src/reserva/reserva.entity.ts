import { DateType, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

@Entity()
export class Reserva extends BaseEntity {
  @Property({ type: DateType })
  fecha!: Date;
  @Property()
  horaInicio!: Date;
  @Property()
  horaFin!: Date;
  @ManyToOne(() => Mesa, { nullable: false })
  mesa!: Mesa;
  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Cliente;
}
