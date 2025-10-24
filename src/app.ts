import "reflect-metadata";
import express from "express";
import { platoRouter } from "./plato/platoRoutes.js";
import { pedidoRouter } from "./pedido/pedido.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/mysql";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/platos", platoRouter);
app.use("/api/pedidos", pedidoRouter);

app.use((_, res) => {
  res.status(404).send("Endpoint not found");
});

await syncSchema();
app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000/");
});
