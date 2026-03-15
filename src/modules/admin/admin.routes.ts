import { Router } from "express";
import {
  getDashboardMensual,
  getCuentasUsuarios,
  getIngresosHoy,
  getMesasOcupadas,
  getObjetivosMensuales,
  getPedidosConfirmadosHoy,
  getTopProductos,
  upsertObjetivosMensuales,
} from "./admin.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const adminRouter = Router();

adminRouter.get(
  "/metricas/pedidos-hoy",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getPedidosConfirmadosHoy,
);
adminRouter.get(
  "/metricas/ingresos-hoy",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getIngresosHoy,
);
adminRouter.get(
  "/metricas/mesas-ocupadas",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getMesasOcupadas,
);
adminRouter.get(
  "/metricas/cuentas-usuarios",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getCuentasUsuarios,
);
adminRouter.get(
  "/dashboard/mensual",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getDashboardMensual,
);
adminRouter.get(
  "/dashboard/objetivos",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getObjetivosMensuales,
);
adminRouter.put(
  "/dashboard/objetivos",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  upsertObjetivosMensuales,
);
adminRouter.get(
  "/dashboard/top-productos",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  getTopProductos,
);
