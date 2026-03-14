import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { orm } from "../../shared/db/orm.js";
import { Pedido, PedidoEstado } from "../pedido/pedido.entity.js";
import { PedidoItem } from "../pedido/pedidoItem.entity.js";
import { Plato } from "../plato/plato.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import {
  MP_ACCESS_TOKEN,
  MP_CURRENCY_ID,
  MP_FAILURE_URL,
  MP_PENDING_URL,
  MP_PUBLIC_KEY,
  MP_SUCCESS_URL,
  MP_WEBHOOK_URL,
} from "../../config/config.js";

const em = orm.em;
const ACTIVE_PEDIDO_STATES = [
  PedidoEstado.PENDING_PAYMENT,
  PedidoEstado.PENDING,
  PedidoEstado.IN_PROGRESS,
];

type CreatePreferenceItemInput = {
  id?: number;
  platoId?: number;
  cantidad: number;
};

export interface CreatePreferenceInput {
  items: CreatePreferenceItemInput[];
}

type WebhookPayload = {
  body?: any;
  query?: Record<string, any>;
};

type PreferenceResult = {
  pedidoId: number;
  total: number;
  preferenceId: string | null;
  initPoint: string | null;
  sandboxInitPoint: string | null;
  externalReference?: string;
  reused?: boolean;
};

type PaymentUpdateResult = {
  updated: boolean;
  reason?: string;
  pedidoId?: number;
  pedidoEstado?: PedidoEstado;
  paymentStatus?: string;
};

export class PaymentService {
  private formatMercadoPagoError(error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.cause?.[0]?.description ||
      error?.cause?.[0]?.code;
    const fallback = error?.message || "unknown Mercado Pago error";
    return apiMessage ? `${apiMessage}` : `${fallback}`;
  }

  private getClients() {
    if (!MP_ACCESS_TOKEN) {
      throw new Error("Mercado Pago access token is missing");
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    return {
      preference: new Preference(client),
      payment: new Payment(client),
    };
  }

  private normalizeItems(items: CreatePreferenceItemInput[]) {
    return items.map((i) => ({
      platoId: Number(i.platoId ?? i.id),
      cantidad: Number(i.cantidad),
    }));
  }

  private getWebhookBaseUrl() {
    const trimmed = MP_WEBHOOK_URL.trim();
    if (!trimmed) return "";

    try {
      const url = new URL(trimmed);
      return `${url.protocol}//${url.host}`;
    } catch {
      return trimmed.replace(/\/api\/payments\/webhook\/?$/, "");
    }
  }

  private resolveBackUrls() {
    const webhookBase = this.getWebhookBaseUrl();

    const normalize = (candidate: string, path: string) => {
      const trimmed = candidate.trim();
      if (!trimmed) {
        return webhookBase ? `${webhookBase}${path}` : "";
      }

      return trimmed;
    };

    const success = normalize(MP_SUCCESS_URL, "/pago/exito");
    const failure = normalize(MP_FAILURE_URL, "/pago/error");
    const pending = normalize(MP_PENDING_URL, "/pago/pendiente");

    if (!success || !failure || !pending) {
      throw new Error("invalid back_urls configuration");
    }

    return { success, failure, pending };
  }

  private async syncMesaEstadoByPedidos(mesaId: number) {
    const mesa = await em.findOne(Mesa, { id: mesaId, deleted: false });
    if (!mesa) return;

    const activePedidosCount = await em.count(Pedido, {
      mesa: mesaId,
      estado: { $in: ACTIVE_PEDIDO_STATES },
    });

    if (activePedidosCount > 0) {
      if (mesa.estado !== MesaEstado.OCUPADA) {
        mesa.estado = MesaEstado.OCUPADA;
        await em.flush();
      }
      return;
    }

    if (mesa.estado !== MesaEstado.DISPONIBLE) {
      mesa.estado = MesaEstado.DISPONIBLE;
      await em.flush();
    }
  }

  private buildPreferenceLinks(preferenceId: string) {
    return {
      preferenceId,
      initPoint: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
      sandboxInitPoint: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
    };
  }

  private async createOrUpdatePreferenceForPedido(
    pedido: Pedido,
  ): Promise<PreferenceResult> {
    if (!pedido.paymentExternalReference) {
      pedido.paymentExternalReference = `pedido-${pedido.id}-${Date.now()}`;
      await em.flush();
    }

    const backUrls = this.resolveBackUrls();
    const mpItems = pedido.items.getItems().map((item) => ({
      id: String(item.plato.id),
      title: item.plato.nombre,
      quantity: item.cantidad,
      unit_price: item.precioUnitario,
      currency_id: MP_CURRENCY_ID,
    }));

    try {
      const { preference } = this.getClients();
      const preferenceResponse = await preference.create({
        body: {
          items: mpItems,
          external_reference: pedido.paymentExternalReference,
          notification_url: MP_WEBHOOK_URL || undefined,
          back_urls: backUrls,
          auto_return: "approved",
        },
      });

      pedido.mpPreferenceId = preferenceResponse.id
        ? String(preferenceResponse.id)
        : undefined;
      pedido.mpPaymentStatus = "pending";
      await em.flush();

      return {
        pedidoId: pedido.id,
        total: pedido.total,
        preferenceId: preferenceResponse.id ?? null,
        initPoint: preferenceResponse.init_point ?? null,
        sandboxInitPoint: preferenceResponse.sandbox_init_point ?? null,
        externalReference: pedido.paymentExternalReference,
      };
    } catch (error: any) {
      pedido.mpPaymentStatus = "preference_error";
      await em.flush();
      throw new Error(
        `unable to create Mercado Pago preference: ${this.formatMercadoPagoError(
          error,
        )}`,
      );
    }
  }

  async createPreferenceForTable(mesaId: number, input: CreatePreferenceInput) {
    if (!input.items?.length) {
      throw new Error("items is required");
    }

    const backUrls = this.resolveBackUrls();
    const normalizedItems = this.normalizeItems(input.items);
    normalizedItems.forEach((item) => {
      if (!Number.isInteger(item.platoId) || item.platoId <= 0) {
        throw new Error("platoId must be a positive integer");
      }
      if (!Number.isFinite(item.cantidad) || item.cantidad <= 0) {
        throw new Error("cantidad must be greater than 0");
      }
    });

    const mesa = await em.findOneOrFail(Mesa, { id: mesaId, deleted: false });
    const platoIds = normalizedItems.map((i) => i.platoId);
    const platos = await em.find(Plato, { id: { $in: platoIds } });

    if (platos.length !== normalizedItems.length) {
      throw new Error("Some platos were not found");
    }

    let total = 0;
    const pedido = em.create(Pedido, {
      mesa,
      estado: PedidoEstado.PENDING_PAYMENT,
      total: 0,
      fechaHora: new Date(),
      mpPaymentStatus: "pending",
    });
    pedido.setMesaOcupada();

    const mpItems = normalizedItems.map((item) => {
      const plato = platos.find((p) => p.id === item.platoId)!;
      total += plato.precio * item.cantidad;

      const pedidoItem = em.create(PedidoItem, {
        pedido,
        plato,
        cantidad: item.cantidad,
        precioUnitario: plato.precio,
      });
      pedido.items.add(pedidoItem);

      return {
        id: String(plato.id),
        title: plato.nombre,
        quantity: item.cantidad,
        unit_price: plato.precio,
        currency_id: MP_CURRENCY_ID,
      };
    });

    pedido.total = total;
    await em.persistAndFlush(pedido);

    try {
      if (!pedido.paymentExternalReference) {
        pedido.paymentExternalReference = `pedido-${pedido.id}-${Date.now()}`;
      }

      const { preference } = this.getClients();
      const preferenceResponse = await preference.create({
        body: {
          items: mpItems,
          external_reference: pedido.paymentExternalReference,
          notification_url: MP_WEBHOOK_URL || undefined,
          back_urls: backUrls,
          auto_return: "approved",
        },
      });

      pedido.mpPreferenceId = preferenceResponse.id
        ? String(preferenceResponse.id)
        : undefined;
      pedido.mpPaymentStatus = "pending";
      await em.flush();

      return {
        pedidoId: pedido.id,
        total: pedido.total,
        preferenceId: preferenceResponse.id ?? null,
        initPoint: preferenceResponse.init_point ?? null,
        sandboxInitPoint: preferenceResponse.sandbox_init_point ?? null,
        externalReference: pedido.paymentExternalReference,
      };
    } catch (error: any) {
      pedido.estado = PedidoEstado.CANCELED;
      pedido.mpPaymentStatus = "preference_error";
      await em.flush();
      await this.syncMesaEstadoByPedidos(pedido.mesa.id);
      throw new Error(
        `unable to create Mercado Pago preference: ${this.formatMercadoPagoError(
          error,
        )}`,
      );
    }
  }

  async getOrCreatePreferenceForPendingPedido(
    mesaId: number,
    pedidoId: number,
    options?: { forceRecreate?: boolean },
  ) {
    const pedido = await em.findOneOrFail(
      Pedido,
      { id: pedidoId },
      { populate: ["mesa", "items.plato"] },
    );

    if (pedido.mesa.id !== mesaId) {
      throw new Error("forbidden");
    }

    if (pedido.estado !== PedidoEstado.PENDING_PAYMENT) {
      throw new Error("pedido is not pending payment");
    }

    if (!pedido.items.length) {
      throw new Error("pedido has no items");
    }

    if (pedido.mpPreferenceId && !options?.forceRecreate) {
      return {
        pedidoId: pedido.id,
        total: pedido.total,
        ...this.buildPreferenceLinks(pedido.mpPreferenceId),
        externalReference: pedido.paymentExternalReference,
        reused: true,
      };
    }

    return this.createOrUpdatePreferenceForPedido(pedido);
  }

  private async applyMercadoPagoPaymentUpdate(
    paymentId: string,
    options?: { expectedMesaId?: number },
  ): Promise<PaymentUpdateResult> {
    const { payment } = this.getClients();
    const paymentResponse = await payment.get({ id: paymentId });
    const externalReference = paymentResponse.external_reference;
    const status = paymentResponse.status?.toLowerCase() ?? "";

    if (!externalReference) {
      return { updated: false, reason: "missing external reference" };
    }

    const pedido = await em.findOne(
      Pedido,
      { paymentExternalReference: externalReference },
      { populate: ["mesa"] },
    );

    if (!pedido) {
      return { updated: false, reason: "pedido not found" };
    }

    if (options?.expectedMesaId && pedido.mesa.id !== options.expectedMesaId) {
      throw new Error("forbidden");
    }

    pedido.mpPaymentId = paymentResponse.id
      ? String(paymentResponse.id)
      : paymentId;
    pedido.mpPaymentStatus = status || pedido.mpPaymentStatus;

    if (status === "approved") {
      pedido.estado = PedidoEstado.PENDING;
      pedido.paidAt = new Date();
    } else if (
      ["rejected", "cancelled", "refunded", "charged_back"].includes(status)
    ) {
      pedido.estado = PedidoEstado.CANCELED;
    }

    await em.flush();
    await this.syncMesaEstadoByPedidos(pedido.mesa.id);

    return {
      updated: true,
      pedidoId: pedido.id,
      pedidoEstado: pedido.estado,
      paymentStatus: pedido.mpPaymentStatus,
    };
  }

  private getWebhookPaymentId(payload: WebhookPayload) {
    const body = payload.body ?? {};
    const query = payload.query ?? {};

    const topicRaw =
      body.type ??
      body.action ??
      query.type ??
      query.topic ??
      query.action ??
      "";
    const topic = String(topicRaw).toLowerCase();
    const isPaymentEvent =
      topic.includes("payment") || body.data?.id || query["data.id"];

    if (!isPaymentEvent) {
      return null;
    }

    const paymentIdRaw = body.data?.id ?? query["data.id"] ?? query.id ?? null;
    if (!paymentIdRaw) {
      return null;
    }

    return String(paymentIdRaw);
  }

  async processWebhook(payload: WebhookPayload) {
    const paymentId = this.getWebhookPaymentId(payload);
    if (!paymentId) {
      return { updated: false, reason: "ignored event" };
    }

    return this.applyMercadoPagoPaymentUpdate(paymentId);
  }

  async confirmPaymentForTable(mesaId: number, paymentId: string) {
    if (!paymentId?.trim()) {
      throw new Error("paymentId is required");
    }
    return this.applyMercadoPagoPaymentUpdate(paymentId, {
      expectedMesaId: mesaId,
    });
  }

  getPublicConfig() {
    if (!MP_PUBLIC_KEY) {
      throw new Error("Mercado Pago public key is missing");
    }

    return { publicKey: MP_PUBLIC_KEY };
  }
}

export const paymentService = new PaymentService();
