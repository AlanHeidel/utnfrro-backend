import "reflect-metadata";
import express from "express";
import cors from "cors";
import { platoRouter } from "./plato/plato.routes.js";
import { pedidoRouter } from "./pedido/pedido.routes.js";
import { tipoPlatoRouter } from "./tipoPlato/tipoPlato.routes.js";
import { mesaRouter } from "./mesa/mesa.routes.js";
import { mozoRouter } from "./mozo/mozo.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/mysql";
import { accountRouter } from "./account/account.routes.js";
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/platos", platoRouter);
app.use("/api/pedidos", pedidoRouter);
app.use("/api/tipoPlatos", tipoPlatoRouter);
app.use("/api/mesas", mesaRouter);
app.use("/api/mozos", mozoRouter);
app.use("/api/accounts", accountRouter);

app.use((_, res) => {
  res.status(404).send("Endpoint not found");
});

await syncSchema();
app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000/");
});
