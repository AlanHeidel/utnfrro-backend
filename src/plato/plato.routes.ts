import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./plato.controller.js";

export const platoRouter = Router();

platoRouter.get("/", findAll);
platoRouter.get("/:id", findOne);
platoRouter.post("/", add);
platoRouter.put("/:id", update);
platoRouter.patch("/:id", update);
platoRouter.delete("/:id", remove);
