import { orm } from "../../shared/db/orm.js";
import { Account, AccountRole } from "../account/account.entity.js";
import { AdminMonthlyObjective } from "./adminMonthlyObjective.entity.js";
import { Mesa, MesaEstado } from "../mesa/mesa.entity.js";
import { Pedido, PedidoEstado } from "../pedido/pedido.entity.js";
import { PedidoItem } from "../pedido/pedidoItem.entity.js";
import { reservaService } from "../reserva/reserva.service.js";

const em = orm.em;

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function round2(value: number) {
  return Number(value.toFixed(2));
}

type MonthWindow = {
  month: string;
  year: number;
  monthIndex: number;
  start: Date;
  end: Date;
  daysInMonth: number;
};

export interface MonthlyObjectiveInput {
  salesTarget: number;
  ordersTarget: number;
  maxCanceledTarget: number;
}

export class AdminService {
  private resolveMonthWindow(monthInput?: string): MonthWindow {
    let year: number;
    let monthIndex: number;

    if (monthInput) {
      const parsed = /^(\d{4})-(\d{2})$/.exec(monthInput.trim());
      if (!parsed) {
        throw new Error("month must have format YYYY-MM");
      }

      year = Number(parsed[1]);
      monthIndex = Number(parsed[2]) - 1;

      if (monthIndex < 0 || monthIndex > 11) {
        throw new Error("month must be between 01 and 12");
      }
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthIndex = now.getMonth();
    }

    const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    const end = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    return {
      month: formatMonthKey(year, monthIndex),
      year,
      monthIndex,
      start,
      end,
      daysInMonth,
    };
  }

  private parseNonNegativeNumber(value: unknown, fieldName: string) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`${fieldName} must be a non-negative number`);
    }
    return n;
  }

  private async getObjectiveOrDefaults(month: string) {
    const objective = await em.findOne(AdminMonthlyObjective, { month });
    if (!objective) {
      return {
        month,
        salesTarget: 0,
        ordersTarget: 0,
        maxCanceledTarget: 0,
      };
    }

    return {
      month: objective.month,
      salesTarget: objective.salesTarget,
      ordersTarget: objective.ordersTarget,
      maxCanceledTarget: objective.maxCanceledTarget,
    };
  }

  async getPedidosConfirmadosHoy() {
    const { start, end } = getTodayRange();

    const cantidad = await em.count(Pedido, {
      fechaHora: { $gte: start, $lt: end },
      estado: {
        $nin: [PedidoEstado.PENDING_PAYMENT, PedidoEstado.CANCELED],
      },
    });

    return {
      fecha: formatLocalDate(start),
      cantidad,
    };
  }

  async getIngresosHoy() {
    const { start, end } = getTodayRange();

    const pedidos = await em.find(Pedido, {
      fechaHora: { $gte: start, $lt: end },
      estado: PedidoEstado.DELIVERED,
    });

    const total = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

    return {
      fecha: formatLocalDate(start),
      total,
      cantidadPedidos: pedidos.length,
    };
  }

  async getMesasOcupadas() {
    await reservaService.syncMesaEstadosPorReservas();

    const totalMesas = await em.count(Mesa, { deleted: false });
    const mesasOcupadas = await em.count(Mesa, {
      deleted: false,
      estado: MesaEstado.OCUPADA,
    });

    return {
      mesasOcupadas,
      totalMesas,
    };
  }

  async getCuentasUsuarios() {
    const totalAccounts = await em.count(Account, {});
    const cuentasUsuarios = await em.count(Account, {
      role: AccountRole.CLIENTE,
    });
    const cuentasAdmin = await em.count(Account, {
      role: AccountRole.ADMIN,
    });

    return {
      cuentasUsuarios,
      totalAccounts,
      cuentasAdmin,
    };
  }

  async getMonthlyObjectives(monthInput?: string) {
    const { month } = this.resolveMonthWindow(monthInput);
    return this.getObjectiveOrDefaults(month);
  }

  async upsertMonthlyObjectives(
    monthInput: string | undefined,
    input: Partial<MonthlyObjectiveInput>,
  ) {
    const { month } = this.resolveMonthWindow(monthInput);

    if (
      input.salesTarget === undefined &&
      input.ordersTarget === undefined &&
      input.maxCanceledTarget === undefined
    ) {
      throw new Error(
        "at least one objective is required (salesTarget, ordersTarget, maxCanceledTarget)",
      );
    }

    let objective = await em.findOne(AdminMonthlyObjective, { month });
    if (!objective) {
      objective = em.create(AdminMonthlyObjective, {
        month,
        salesTarget: 0,
        ordersTarget: 0,
        maxCanceledTarget: 0,
      });
    }

    if (input.salesTarget !== undefined) {
      objective.salesTarget = this.parseNonNegativeNumber(
        input.salesTarget,
        "salesTarget",
      );
    }
    if (input.ordersTarget !== undefined) {
      objective.ordersTarget = this.parseNonNegativeNumber(
        input.ordersTarget,
        "ordersTarget",
      );
    }
    if (input.maxCanceledTarget !== undefined) {
      objective.maxCanceledTarget = this.parseNonNegativeNumber(
        input.maxCanceledTarget,
        "maxCanceledTarget",
      );
    }

    await em.persistAndFlush(objective);
    return {
      month: objective.month,
      salesTarget: objective.salesTarget,
      ordersTarget: objective.ordersTarget,
      maxCanceledTarget: objective.maxCanceledTarget,
    };
  }

  async getMonthlyDashboard(monthInput?: string) {
    const { month, start, end, daysInMonth, year, monthIndex } =
      this.resolveMonthWindow(monthInput);

    const objetivos = await this.getObjectiveOrDefaults(month);

    const pedidos = await em.find(Pedido, {
      fechaHora: { $gte: start, $lt: end },
    });

    const ingresosPorDiaMap = new Map<number, number>();
    const estadoCount = new Map<PedidoEstado, number>(
      Object.values(PedidoEstado).map((estado) => [estado, 0]),
    );

    let ventasMes = 0;
    let pedidosMes = 0;
    let cancelacionesMes = 0;

    for (const pedido of pedidos) {
      estadoCount.set(
        pedido.estado,
        (estadoCount.get(pedido.estado) ?? 0) + 1,
      );

      if (pedido.estado === PedidoEstado.DELIVERED) {
        ventasMes += pedido.total;
        const dia = pedido.fechaHora.getDate();
        ingresosPorDiaMap.set(dia, (ingresosPorDiaMap.get(dia) ?? 0) + pedido.total);
      }

      if (
        pedido.estado !== PedidoEstado.PENDING_PAYMENT &&
        pedido.estado !== PedidoEstado.CANCELED
      ) {
        pedidosMes += 1;
      }

      if (pedido.estado === PedidoEstado.CANCELED) {
        cancelacionesMes += 1;
      }
    }

    const evolucionIngresos = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const fecha = new Date(year, monthIndex, day);
      return {
        day,
        fecha: formatLocalDate(fecha),
        ingresos: ingresosPorDiaMap.get(day) ?? 0,
      };
    });

    const distribucionEstados = Object.values(PedidoEstado).map((estado) => ({
      estado,
      cantidad: estadoCount.get(estado) ?? 0,
    }));

    const ventasProgress =
      objetivos.salesTarget > 0
        ? round2((ventasMes / objetivos.salesTarget) * 100)
        : 0;
    const pedidosProgress =
      objetivos.ordersTarget > 0
        ? round2((pedidosMes / objetivos.ordersTarget) * 100)
        : 0;
    const cancelacionesUsoLimite =
      objetivos.maxCanceledTarget > 0
        ? round2((cancelacionesMes / objetivos.maxCanceledTarget) * 100)
        : 0;

    return {
      month,
      rango: {
        desde: formatLocalDate(start),
        hasta: formatLocalDate(new Date(end.getTime() - 1)),
      },
      graficas: {
        evolucionIngresos,
        distribucionEstados,
      },
      objetivos: {
        ventas: {
          actual: ventasMes,
          objetivo: objetivos.salesTarget,
          porcentajeCumplido: ventasProgress,
          faltante: Math.max(objetivos.salesTarget - ventasMes, 0),
        },
        pedidos: {
          actual: pedidosMes,
          objetivo: objetivos.ordersTarget,
          porcentajeCumplido: pedidosProgress,
          faltante: Math.max(objetivos.ordersTarget - pedidosMes, 0),
        },
        cancelaciones: {
          actual: cancelacionesMes,
          maximoTolerado: objetivos.maxCanceledTarget,
          porcentajeUsoLimite: cancelacionesUsoLimite,
          restanteHastaLimite: Math.max(
            objetivos.maxCanceledTarget - cancelacionesMes,
            0,
          ),
          limiteSuperado:
            objetivos.maxCanceledTarget > 0 &&
            cancelacionesMes > objetivos.maxCanceledTarget,
        },
      },
    };
  }

  async getTopProductos(monthInput?: string, limitInput?: number) {
    const { month, start, end } = this.resolveMonthWindow(monthInput);
    const limit =
      Number.isInteger(limitInput) && (limitInput as number) > 0
        ? Math.min(limitInput as number, 20)
        : 4;

    const items = await em.find(
      PedidoItem,
      {
        pedido: {
          estado: PedidoEstado.DELIVERED,
          fechaHora: { $gte: start, $lt: end },
        },
      },
      {
        populate: ["plato.tipoPlato"],
      },
    );

    const byPlato = new Map<
      number,
      {
        platoId: number;
        titulo: string;
        imagen: string | null;
        tipoPlato: string;
        precioVenta: number;
        unidadesVendidas: number;
        ingresoGenerado: number;
      }
    >();

    for (const item of items) {
      const plato = item.plato;
      const current = byPlato.get(plato.id);

      if (!current) {
        byPlato.set(plato.id, {
          platoId: plato.id,
          titulo: plato.nombre,
          imagen: plato.imagen ?? null,
          tipoPlato: plato.tipoPlato.name,
          precioVenta: plato.precio,
          unidadesVendidas: item.cantidad,
          ingresoGenerado: item.cantidad * item.precioUnitario,
        });
        continue;
      }

      current.unidadesVendidas += item.cantidad;
      current.ingresoGenerado += item.cantidad * item.precioUnitario;
    }

    const topProductos = [...byPlato.values()]
      .sort((a, b) => {
        if (b.unidadesVendidas !== a.unidadesVendidas) {
          return b.unidadesVendidas - a.unidadesVendidas;
        }
        return b.ingresoGenerado - a.ingresoGenerado;
      })
      .slice(0, limit);

    return {
      month,
      limit,
      data: topProductos,
    };
  }
}

export const adminService = new AdminService();
