import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./plato.controller.js";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const platoRouter = Router();

platoRouter.get("/", findAll);
platoRouter.get("/:id", findOne);
platoRouter.post("/", requireAuth, requireRole(AccountRole.ADMIN), add);
platoRouter.put("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
platoRouter.patch("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
platoRouter.delete("/:id", requireAuth, requireRole(AccountRole.ADMIN), remove);
