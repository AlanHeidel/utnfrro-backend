import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./pedido.controller.js";
import { requireAuth, requireRole, requireTableDevice } from "../auth/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const pedidoRouter = Router();

pedidoRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), findAll);
pedidoRouter.get("/:id", requireTableDevice, findOne);
pedidoRouter.post("/", requireTableDevice, add);
pedidoRouter.put("/:id", requireTableDevice, update);
pedidoRouter.delete("/:id", requireAuth, requireRole(AccountRole.ADMIN), remove);
