import { Router } from "express";
import {
  sanitizeMesaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./mesaController.js";

export const mesaRouter = Router();

mesaRouter.get("/", findAll);
mesaRouter.get("/:id", findOne);
mesaRouter.post("/", sanitizeMesaInput, add);
mesaRouter.put("/:id", sanitizeMesaInput, update);
mesaRouter.patch("/:id", sanitizeMesaInput, update);
mesaRouter.delete("/:id", remove);
