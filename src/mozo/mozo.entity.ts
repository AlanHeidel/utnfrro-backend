import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class Mozo extends BaseEntity {
  @Property()
  nombre!: string;
  @Property()
  apellido!: string;
}
