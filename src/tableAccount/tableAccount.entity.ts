import { Entity, OneToOne, Property, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";

@Entity()
export class TableAccount extends BaseEntity {
  @Property({ unique: true })
  identifier!: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @OneToOne(() => Mesa, { unique: true, cascade: [Cascade.REMOVE] })
  mesa!: Mesa;

  @Property({ nullable: true })
  nombre?: string;

  @Property({ nullable: true })
  ultimoLogin?: Date;
}
