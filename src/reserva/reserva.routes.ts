import { Router } from "express";
import {
  cancelReserva,
  createReserva,
  disponibilidadReservas,
  finalizeReserva,
  findAllReservas,
  findOneReserva,
} from "./reserva.controller.js";
import { requireAuth } from "../auth/auth.middleware.js";

export const reservaRouter = Router();

reservaRouter.get("/disponibilidad", disponibilidadReservas);
reservaRouter.get("/", requireAuth, findAllReservas);
reservaRouter.get("/:id", requireAuth, findOneReserva);
reservaRouter.post("/", requireAuth, createReserva);
reservaRouter.delete("/:id", requireAuth, cancelReserva);
reservaRouter.patch("/:id/finalizar", requireAuth, finalizeReserva);
