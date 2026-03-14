import { describe, expect, it } from "vitest";
import { PedidoEstado } from "../../../modules/pedido/pedido.entity.js";
import { canTransitionPedidoState } from "../../../modules/pedido/pedido-state.rules.js";

describe("canTransitionPedidoState", () => {
  it("permite cambiar estado desde pending_payment", () => {
    expect(
      canTransitionPedidoState(
        PedidoEstado.PENDING_PAYMENT,
        PedidoEstado.PENDING,
      ),
    ).toBe(true);
  });

  it("permite cambiar estado desde pending", () => {
    expect(
      canTransitionPedidoState(PedidoEstado.PENDING, PedidoEstado.IN_PROGRESS),
    ).toBe(true);
  });

  it("permite cambiar estado desde in_progress", () => {
    expect(
      canTransitionPedidoState(PedidoEstado.IN_PROGRESS, PedidoEstado.DELIVERED),
    ).toBe(true);
  });

  it("no permite cambiar estado desde canceled", () => {
    expect(
      canTransitionPedidoState(PedidoEstado.CANCELED, PedidoEstado.PENDING),
    ).toBe(false);
  });

  it("no permite cambiar estado desde delivered", () => {
    expect(
      canTransitionPedidoState(PedidoEstado.DELIVERED, PedidoEstado.PENDING),
    ).toBe(false);
  });
});

