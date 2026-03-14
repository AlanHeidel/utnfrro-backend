import { Router } from "express";
import {
  findAll,
  findDestacados,
  findMenu,
  findOne,
  add,
  update,
  remove,
} from "./plato.controller.js";
import {
  requireAuth,
  requireRole,
  requireTableDevice,
} from "../../middlewares/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const platoRouter = Router();

platoRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), findAll);
platoRouter.get("/destacados", findDestacados);
platoRouter.get("/menu", requireTableDevice, findMenu);
platoRouter.get("/:id", findOne);
platoRouter.post("/", requireAuth, requireRole(AccountRole.ADMIN), add);
platoRouter.put("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
platoRouter.patch("/:id", requireAuth, requireRole(AccountRole.ADMIN), update);
platoRouter.delete("/:id", requireAuth, requireRole(AccountRole.ADMIN), remove);
