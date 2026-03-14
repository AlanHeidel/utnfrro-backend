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
  res: Response,
) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedido = await pedidoService.createFromTableDevice(mesaId, req.body);
    res.status(201).json({ message: "pedido creado", data: pedido });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message ?? "unable to create pedido" });
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
    res
      .status(400)
      .json({ message: error.message ?? "unable to update pedido" });
  }
}

async function getPendingPedidosForTableDevice(
  req: Request & { user?: AnyTokenPayload },
  res: Response,
) {
  try {
    const tokenMesaId =
      req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!tokenMesaId) return res.status(403).json({ message: "forbidden" });

    const mesaId = Number.parseInt(req.params.id);
    if (!Number.isInteger(mesaId)) {
      return res.status(400).json({ message: "mesa id must be a number" });
    }

    if (mesaId !== tokenMesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedidos = await pedidoService.findPendingForMesa(mesaId);
    res.status(200).json({ data: pedidos });
  } catch (error: any) {
    if (error.message === "no pending pedido for mesa") {
      return res.status(200).json({ data: [] });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to list pedidos" });
  }
}

async function getInProgressPedidosForTableDevice(
  req: Request & { user?: AnyTokenPayload },
  res: Response,
) {
  try {
    const tokenMesaId =
      req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!tokenMesaId) return res.status(403).json({ message: "forbidden" });

    const mesaId = Number.parseInt(req.params.id);
    if (!Number.isInteger(mesaId)) {
      return res.status(400).json({ message: "mesa id must be a number" });
    }

    if (mesaId !== tokenMesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedidos = await pedidoService.findInProgressForMesa(mesaId);
    res.status(200).json({ data: pedidos });
  } catch (error: any) {
    if (error.message === "no in-progress pedido for mesa") {
      return res.status(200).json({ data: [] });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to list pedidos" });
  }
}

async function getPendingPaymentPedidosForTableDevice(
  req: Request & { user?: AnyTokenPayload },
  res: Response,
) {
  try {
    const tokenMesaId =
      req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!tokenMesaId) return res.status(403).json({ message: "forbidden" });

    const mesaId = Number.parseInt(req.params.id);
    if (!Number.isInteger(mesaId)) {
      return res.status(400).json({ message: "mesa id must be a number" });
    }

    if (mesaId !== tokenMesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedidos = await pedidoService.findPendingPaymentForMesa(mesaId);
    res.status(200).json({ data: pedidos });
  } catch (error: any) {
    if (error.message === "no pending-payment pedido for mesa") {
      return res.status(200).json({ data: [] });
    }
    res
      .status(500)
      .json({ message: error.message ?? "unable to list pedidos" });
  }
}

export {
  findAll,
  findOne,
  createFromTableDevice,
  updateEstado,
  getPendingPedidosForTableDevice,
  getInProgressPedidosForTableDevice,
  getPendingPaymentPedidosForTableDevice,
};
