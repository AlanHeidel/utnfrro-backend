import { Entity, Enum, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";
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

  @Property({ hidden: true })
  passwordHash!: string;

  @Enum(() => AccountRole)
  role: AccountRole = AccountRole.CLIENTE;

  @Property({ nullable: true })
  ultimoLogin?: Date;
}
