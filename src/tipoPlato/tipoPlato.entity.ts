import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class TipoPlato extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string;
}
