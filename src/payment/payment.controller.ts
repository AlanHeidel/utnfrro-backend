import { Request, Response } from "express";
import { NotFoundError } from "@mikro-orm/core";
import { AnyTokenPayload } from "../auth/auth.utils.js";
import { paymentService } from "./payment.service.js";

type AuthRequest = Request & { user?: AnyTokenPayload };

export async function createPreferenceForTable(req: AuthRequest, res: Response) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const result = await paymentService.createPreferenceForTable(mesaId, req.body);
    return res
      .status(201)
      .json({ message: "payment preference created", data: result });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message ?? "unable to create payment preference" });
  }
}

export async function getOrCreatePreferenceForPendingPedido(
  req: AuthRequest,
  res: Response
) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const pedidoId = Number.parseInt(req.params.pedidoId);
    if (!Number.isInteger(pedidoId)) {
      return res.status(400).json({ message: "pedido id must be a number" });
    }

    const forceRecreate =
      String(req.query.recreate ?? "false").toLowerCase() === "true";

    const result = await paymentService.getOrCreatePreferenceForPendingPedido(
      mesaId,
      pedidoId,
      { forceRecreate }
    );

    return res.status(200).json({
      message: "payment preference ready",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "pedido not found" });
    }

    if (error.message === "forbidden") {
      return res.status(403).json({ message: "forbidden" });
    }

    return res
      .status(400)
      .json({ message: error.message ?? "unable to prepare payment preference" });
  }
}

export async function confirmPaymentForTable(req: AuthRequest, res: Response) {
  try {
    const mesaId = req.user?.kind === "table-device" ? req.user.mesaId : null;
    if (!mesaId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const paymentId = String(
      req.body?.paymentId ??
        req.query.payment_id ??
        req.query.id ??
        req.query["data.id"] ??
        ""
    ).trim();

    if (!paymentId) {
      return res.status(400).json({ message: "paymentId is required" });
    }

    const result = await paymentService.confirmPaymentForTable(mesaId, paymentId);
    return res.status(200).json({
      message: "payment confirmation processed",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "forbidden") {
      return res.status(403).json({ message: "forbidden" });
    }
    return res
      .status(400)
      .json({ message: error.message ?? "unable to confirm payment" });
  }
}

export async function mercadoPagoWebhook(req: Request, res: Response) {
  try {
    const result = await paymentService.processWebhook({
      body: req.body,
      query: req.query as Record<string, any>,
    });
    return res.status(200).json({ message: "webhook processed", data: result });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message ?? "unable to process webhook" });
  }
}

export async function getMercadoPagoPublicKey(_req: Request, res: Response) {
  try {
    const config = paymentService.getPublicConfig();
    return res.status(200).json({ data: config });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message ?? "unable to load payment config" });
  }
}
