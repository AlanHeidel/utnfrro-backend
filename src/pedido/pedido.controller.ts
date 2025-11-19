import { Request, Response } from "express";
import { pedidoService } from "./pedido.service.js";
import { PedidoEstado } from "./pedido.entity.js";
import { AnyTokenPayload } from "../auth/auth.utils.js";

async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await pedidoService.list();
    res.status(200).json({ message: "finded all pedidos", data: pedidos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pedido = await pedidoService.findOne(id);
    res.status(200).json({ message: "found pedido", data: pedido });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function createFromTableDevice(
  req: Request & { user?: AnyTokenPayload },
  res: Response
) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedido = await pedidoService.createFromTableDevice(mesaId, req.body);
    res.status(201).json({ message: "pedido creado", data: pedido });
  } catch (error: any) {
    res.status(400).json({ message: error.message ?? "unable to create pedido" });
  }
}

async function updateEstado(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const estado = req.body?.estado as PedidoEstado;
    if (!estado) {
      return res.status(400).json({ message: "estado is required" });
    }
    const pedido = await pedidoService.updateEstado(id, estado);
    res.status(200).json({ message: "pedido updated", data: pedido });
  } catch (error: any) {
    res.status(400).json({ message: error.message ?? "unable to update pedido" });
  }
}

async function getPedidoForTableDevice(
  req: Request & { user?: AnyTokenPayload },
  res: Response
) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) return res.status(403).json({ message: "forbidden" });

    const id = Number.parseInt(req.params.id);
    const pedido = await pedidoService.findOneForMesa(id, mesaId);
    res.status(200).json({ data: pedido });
  } catch (error: any) {
    if (error.message === "forbidden") {
      return res.status(403).json({ message: "forbidden" });
    }
    res.status(404).json({ message: error.message ?? "pedido not found" });
  }
}

export { findAll, findOne, createFromTableDevice, updateEstado, getPedidoForTableDevice };
