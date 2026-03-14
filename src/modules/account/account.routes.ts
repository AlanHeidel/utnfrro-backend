import { Router } from "express";
import {
  createTableDeviceAccount,
  getAccount,
  listAccounts,
  listTableAccounts,
  login,
  registerCliente,
} from "./account.controller.js";

export const accountRouter = Router();

accountRouter.post("/register", registerCliente);
accountRouter.post("/login", login);
accountRouter.get("/", listAccounts);
accountRouter.post("/table-device", createTableDeviceAccount);
accountRouter.get("/table-device", listTableAccounts);
accountRouter.get("/:id", getAccount);
