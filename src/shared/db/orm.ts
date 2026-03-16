import { MikroORM } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { Account } from "../../modules/account/account.entity.js";
import { Mesa } from "../../modules/mesa/mesa.entity.js";
import { Mozo } from "../../modules/mozo/mozo.entity.js";
import { Pedido } from "../../modules/pedido/pedido.entity.js";
import { PedidoItem } from "../../modules/pedido/pedidoItem.entity.js";
import { Plato } from "../../modules/plato/plato.entity.js";
import { Reserva } from "../../modules/reserva/reserva.entity.js";
import { TableAccount } from "../../modules/tableAccount/tableAccount.entity.js";
import { TipoPlato } from "../../modules/tipoPlato/tipoPlato.entity.js";
import { AdminMonthlyObjective } from "../../modules/admin/adminMonthlyObjective.entity.js";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  ORM_DEBUG,
} from "../../config/config.js";

export const orm = await MikroORM.init({
  entities: [
    Account,
    Mesa,
    Mozo,
    Pedido,
    PedidoItem,
    Plato,
    Reserva,
    TableAccount,
    TipoPlato,
    AdminMonthlyObjective,
  ],
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  dbName: DB_NAME,
  highlighter: new SqlHighlighter(),
  debug: ORM_DEBUG,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
