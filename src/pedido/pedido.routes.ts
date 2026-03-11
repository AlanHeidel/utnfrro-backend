import { Router } from "express";
import {
  createFromTableDevice,
  findAll,
  findOne,
  getInProgressPedidosForTableDevice,
  getPendingPedidosForTableDevice,
  updateEstado,
} from "./pedido.controller.js";
import {
  requireAuth,
  requireRole,
  requireTableDevice,
} from "../auth/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const pedidoRouter = Router();

pedidoRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), findAll);
pedidoRouter.get("/:id", requireAuth, requireRole(AccountRole.ADMIN), findOne);
pedidoRouter.get(
  "/table/:id/recibidos",
  requireTableDevice,
  getPendingPedidosForTableDevice
);
pedidoRouter.get(
  "/table/:id/en-cocina",
  requireTableDevice,
  getInProgressPedidosForTableDevice
);
pedidoRouter.post("/table", requireTableDevice, createFromTableDevice);
pedidoRouter.patch(
  "/:id/estado",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  updateEstado,
);
