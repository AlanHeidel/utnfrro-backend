import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/db/baseEntity.entity.js";

@Entity({ tableName: "admin_monthly_objective" })
export class AdminMonthlyObjective extends BaseEntity {
  @Property({ unique: true })
  month!: string; // YYYY-MM

  @Property({ default: 0 })
  salesTarget: number = 0;

  @Property({ default: 0 })
  ordersTarget: number = 0;

  @Property({ default: 0 })
  maxCanceledTarget: number = 0;
}
