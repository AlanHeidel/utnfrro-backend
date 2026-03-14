import { Request, Response } from "express";
import { orm } from "../../shared/db/orm.js";
import { Mozo } from "./mozo.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";
import { NotFoundError } from "@mikro-orm/core";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const mozos = await em.find(Mozo, { deleted: false });
    res.status(200).json({ message: "finded all mozos", data: mozos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const mozo = em.create(Mozo, req.body);
    await em.flush();
    res.status(201).json({ message: "Mozo was created", data: mozo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mozo = await em.findOneOrFail(Mozo, { id, deleted: false });
    res.status(200).json({ message: "found mozo", data: mozo });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mozo not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mozo = await em.findOneOrFail(Mozo, { id, deleted: false });
    em.assign(mozo, req.body);
    await em.flush();
    res.status(200).json({ message: "mozo updated" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mozo not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mozo = await em.findOneOrFail(Mozo, { id, deleted: false });
    const mesas = await em.find(Mesa, { mozo, deleted: false });
    for (const mesa of mesas) {
      mesa.mozo = null;
    }
    mozo.deleted = true;
    await em.flush();
    res.status(200).send({ message: "Mozo deleted" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mozo not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
