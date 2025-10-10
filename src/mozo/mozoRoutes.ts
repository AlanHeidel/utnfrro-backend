import { Router } from "express";
import {
  sanitizeMozoInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./mozoController.js";

export const mozoRouter = Router();

mozoRouter.get("/", findAll);
mozoRouter.get("/:id", findOne);
mozoRouter.post("/", sanitizeMozoInput, add);
mozoRouter.put("/:id", sanitizeMozoInput, update);
mozoRouter.patch("/:id", sanitizeMozoInput, update);
mozoRouter.delete("/:id", remove);
