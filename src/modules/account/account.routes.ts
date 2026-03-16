import { Router } from "express";
import {
  createTableDeviceAccount,
  getAccount,
  listAccounts,
  listTableAccounts,
  login,
  registerCliente,
} from "./account.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { AccountRole } from "./account.entity.js";

export const accountRouter = Router();

accountRouter.post("/register", registerCliente);
accountRouter.post("/login", login);
accountRouter.get("/", requireAuth, requireRole(AccountRole.ADMIN), listAccounts);
accountRouter.post(
  "/table-device",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  createTableDeviceAccount,
);
accountRouter.get(
  "/table-device",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  listTableAccounts,
);
accountRouter.get(
  "/:id",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getAccount,
);
