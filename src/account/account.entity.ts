import { Entity, Enum, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";
export enum AccountRole {
  CLIENTE = "CLIENTE",
  TABLE_DEVICE = "TABLE_DEVICE",
  ADMIN = "ADMIN",
}

@Entity()
export class Account extends BaseEntity {
  @Property({ nullable: true })
  nombre?: string;

  @Unique()
  @Property()
  email!: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @Enum(() => AccountRole)
  role: AccountRole = AccountRole.CLIENTE;

  @ManyToOne(() => Cliente, { nullable: true })
  cliente?: Cliente;

  @ManyToOne(() => Mesa, { nullable: true })
  mesa?: Mesa;

  @Property({ nullable: true })
  ultimoLogin?: Date;
}
