import "reflect-metadata";
import express from "express";
import cors from "cors";
import { platoRouter } from "./modules/plato/plato.routes.js";
import { pedidoRouter } from "./modules/pedido/pedido.routes.js";
import { tipoPlatoRouter } from "./modules/tipoPlato/tipoPlato.routes.js";
import { mesaRouter } from "./modules/mesa/mesa.routes.js";
import { mozoRouter } from "./modules/mozo/mozo.routes.js";
import { orm } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/mysql";
import { accountRouter } from "./modules/account/account.routes.js";
import { reservaRouter } from "./modules/reserva/reserva.routes.js";
import { paymentRouter } from "./modules/payment/payment.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { FRONTEND_BASE_URL, IS_PROD } from "./config/config.js";
import "dotenv/config";

const app = express();

const defaultAllowedOrigins = IS_PROD
  ? [FRONTEND_BASE_URL]
  : [FRONTEND_BASE_URL, "http://localhost:5173", "http://127.0.0.1:5173"];

const envAllowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
]);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  // Quick Tunnel de Cloudflare
  if (/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/i.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin ?? undefined)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin ?? "unknown"}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
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
app.use("/api/reservas", reservaRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

app.use((_, res) => {
  res.status(404).send("Endpoint not found");
});

export { app };
