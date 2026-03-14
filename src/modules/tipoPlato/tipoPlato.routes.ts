import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./tipoPlato.controller.js";

export const tipoPlatoRouter = Router();

tipoPlatoRouter.get("/", findAll);
tipoPlatoRouter.get("/:id", findOne);
tipoPlatoRouter.post("/", add);
tipoPlatoRouter.put("/:id", update);
tipoPlatoRouter.delete("/:id", remove);