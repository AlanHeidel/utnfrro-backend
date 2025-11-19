import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./mozo.controller.js";
import { requireAuth, requireRole, requireTableDevice } from "../auth/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const mozoRouter = Router();

mozoRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), findAll);
mozoRouter.get("/:id", requireAuth, requireRole(AccountRole.ADMIN), findOne);
mozoRouter.post("/", requireAuth, requireRole(AccountRole.ADMIN), add);
mozoRouter.put("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
mozoRouter.delete("/:id", requireAuth, requireRole(AccountRole.ADMIN), remove);
