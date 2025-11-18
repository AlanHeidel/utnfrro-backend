import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./mozo.controller.js";

export const mozoRouter = Router();

mozoRouter.get("/", findAll);
mozoRouter.get("/:id", findOne);
mozoRouter.post("/", add);
mozoRouter.put("/:id", update);
mozoRouter.delete("/:id", remove);
