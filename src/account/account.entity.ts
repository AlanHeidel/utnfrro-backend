import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";
export enum AccountRole {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
}

@Entity()
export class Account extends BaseEntity {
  @Property({ nullable: true })
  nombre?: string;

  @Property({ unique: true })
  identifier!: string;

  @Property({ hidden: true, nullable: true })
  passwordHash?: string;

  @Enum(() => AccountRole)
  role: AccountRole = AccountRole.CLIENTE;

  @ManyToOne(() => Cliente, { nullable: true })
  cliente?: Cliente;

  @Property({ nullable: true })
  ultimoLogin?: Date;
}
