import { PedidoEstado } from "./pedido.entity.js";

const TERMINAL_PEDIDO_STATES = [PedidoEstado.CANCELED, PedidoEstado.DELIVERED];

export function canTransitionPedidoState(
  currentState: PedidoEstado,
  _nextState: PedidoEstado,
) {
  return !TERMINAL_PEDIDO_STATES.includes(currentState);
}

