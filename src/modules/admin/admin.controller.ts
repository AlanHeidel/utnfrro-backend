import { Request, Response } from "express";
import { adminService, MonthlyObjectiveInput } from "./admin.service.js";

export async function getPedidosConfirmadosHoy(req: Request, res: Response) {
  try {
    const data = await adminService.getPedidosConfirmadosHoy();
    res.status(200).json({ message: "pedidos de hoy", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getIngresosHoy(req: Request, res: Response) {
  try {
    const data = await adminService.getIngresosHoy();
    res.status(200).json({ message: "ingresos de hoy", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMesasOcupadas(req: Request, res: Response) {
  try {
    const data = await adminService.getMesasOcupadas();
    res.status(200).json({ message: "estado de mesas", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCuentasUsuarios(req: Request, res: Response) {
  try {
    const data = await adminService.getCuentasUsuarios();
    res.status(200).json({ message: "cuentas de usuarios", data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getDashboardMensual(req: Request, res: Response) {
  try {
    const month =
      typeof req.query.month === "string" ? req.query.month : undefined;
    const data = await adminService.getMonthlyDashboard(month);
    res.status(200).json({ message: "dashboard mensual", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getObjetivosMensuales(req: Request, res: Response) {
  try {
    const month =
      typeof req.query.month === "string" ? req.query.month : undefined;
    const data = await adminService.getMonthlyObjectives(month);
    res.status(200).json({ message: "objetivos mensuales", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function upsertObjetivosMensuales(req: Request, res: Response) {
  try {
    const month =
      typeof req.query.month === "string" ? req.query.month : undefined;
    const payload = req.body as Partial<MonthlyObjectiveInput>;
    const data = await adminService.upsertMonthlyObjectives(month, payload);
    res.status(200).json({ message: "objetivos mensuales actualizados", data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getTopProductos(req: Request, res: Response) {
  try {
    const month =
      typeof req.query.month === "string" ? req.query.month : undefined;
    const limitRaw =
      typeof req.query.limit === "string"
        ? Number.parseInt(req.query.limit, 10)
        : undefined;

    const data = await adminService.getTopProductos(month, limitRaw);
    res.status(200).json({ message: "top productos", ...data });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
