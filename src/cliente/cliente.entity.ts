import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class Cliente extends BaseEntity {
  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: true })
  nombre?: string;

  @Property({ nullable: true })
  telefono?: string;
}
