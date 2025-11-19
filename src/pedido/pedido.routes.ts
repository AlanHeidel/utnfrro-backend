import { Router } from "express";
import {
  createFromTableDevice,
  findAll,
  findOne,
  updateEstado,
  getPedidoForTableDevice
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
  "/table/:id",
  requireTableDevice,
  getPedidoForTableDevice
);
pedidoRouter.post("/table", requireTableDevice, createFromTableDevice);
pedidoRouter.patch(
  "/:id/estado",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  updateEstado
);
