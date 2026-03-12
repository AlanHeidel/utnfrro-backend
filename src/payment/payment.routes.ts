import { Router } from "express";
import {
  confirmPaymentForTable,
  createPreferenceForTable,
  getOrCreatePreferenceForPendingPedido,
  getMercadoPagoPublicKey,
  mercadoPagoWebhook,
} from "./payment.controller.js";
import { requireTableDevice } from "../auth/auth.middleware.js";

export const paymentRouter = Router();

paymentRouter.get("/public-key", getMercadoPagoPublicKey);
paymentRouter.post("/table/preference", requireTableDevice, createPreferenceForTable);
paymentRouter.post("/table/confirm", requireTableDevice, confirmPaymentForTable);
paymentRouter.post(
  "/table/pedidos/:pedidoId/preference",
  requireTableDevice,
  getOrCreatePreferenceForPendingPedido
);
paymentRouter.post("/webhook", mercadoPagoWebhook);
