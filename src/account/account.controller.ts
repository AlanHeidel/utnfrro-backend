import { Request, Response } from "express";
import { accountService, RegisterClienteInput } from "./account.service.js";
import {
  tableAccountService,
  CreateTableAccountInput,
} from "../tableAccount/tableAccount.service.js";
import { AccountRole } from "./account.entity.js";
import { signAccountToken, signTableToken } from "../auth/auth.utils.js";

function badRequest(res: Response, message: string) {
  return res.status(400).json({ message });
}

export async function registerCliente(req: Request, res: Response) {
  try {
    const payload = req.body as Partial<RegisterClienteInput>;
    if (!payload?.email || !payload?.password) {
      return badRequest(res, "email and password are required");
    }

    const account = await accountService.registerCliente({
      email: payload.email,
      password: payload.password,
      nombre: payload.nombre,
      clienteId: payload.clienteId,
    });

    res.status(201).json({ message: "account created", data: account });
  } catch (error: any) {
    res.status(400).json({ message: error.message ?? "unable to create account" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body ?? {};
    if (!identifier || !password) {
      return res.status(400).json({ message: "identifier and password are required" });
    }

    // login en Account (CLIENTE/ADMIN)
    const account = await accountService.validateCredentials(identifier, password);
    if (account) {
      const token = signAccountToken({ sub: account.id, role: account.role, clienteId: account.cliente?.id ?? null });
      return res.status(200).json({ message: "login successful", data: account, type: account.role === AccountRole.ADMIN ? "admin" : "client", token });

    }

    //login en TableAccount (table-device)
    const tableAccount = await tableAccountService.validateCredentials(identifier, password);
    if (tableAccount) {
      const token = signTableToken({ sub: tableAccount.id, mesaId: tableAccount.mesa.id });
      return res.status(200).json({ message: "login successful", data: tableAccount, type: "table-device", token });
    }

    return res.status(401).json({ message: "invalid credentials" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message ?? "login failed" });
  }
}

export async function createTableDeviceAccount(req: Request, res: Response) {
  try {
    const payload = req.body as Partial<CreateTableAccountInput>;
    const mesaId = Number.parseInt(payload?.mesaId as any);
    if (!Number.isInteger(mesaId)) {
      return badRequest(res, "mesaId must be a number");
    }

    if (!payload?.password) {
      return badRequest(res, "password is required");
    }

    const account = await tableAccountService.create({
      mesaId,
      password: payload.password,
      identifier: payload.identifier,
      nombre: payload.nombre,
    });

    res.status(201).json({ message: "table device account ready", data: account });
  } catch (error: any) {
    res.status(400).json({ message: error.message ?? "unable to create table device account" });
  }
}

export async function listAccounts(_req: Request, res: Response) {
  try {
    const accounts = await accountService.list();
    res.status(200).json({ data: accounts });
  } catch (error: any) {
    res.status(500).json({ message: error.message ?? "unable to list accounts" });
  }
}

export async function getAccount(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    if (!Number.isInteger(id)) {
      return badRequest(res, "id must be a number");
    }

    const account = await accountService.findOne(id);
    res.status(200).json({ data: account });
  } catch (error: any) {
    res.status(404).json({ message: error.message ?? "account not found" });
  }
}

export async function listTableAccounts(_req: Request, res: Response) {
  try {
    const accounts = await tableAccountService.list();
    res.status(200).json({ data: accounts });
  } catch (error: any) {
    res.status(500).json({ message: error.message ?? "unable to list table accounts" });
  }
}
