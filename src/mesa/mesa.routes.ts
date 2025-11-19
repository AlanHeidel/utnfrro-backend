import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./mesa.controller.js";
import { requireAuth, requireRole, requireTableDevice } from "../auth/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const mesaRouter = Router();

mesaRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), findAll);
mesaRouter.get("/:id", requireTableDevice, findOne);
mesaRouter.post("/", requireAuth, requireRole(AccountRole.ADMIN), add);
mesaRouter.put("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
mesaRouter.delete("/:id", requireAuth, requireRole(AccountRole.ADMIN), remove);
