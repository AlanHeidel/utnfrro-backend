import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Plato } from "./plato.entity.js";

// function sanitizePlatoInput(req: Request, _: Response, next: NextFunction) {
//   req.body.sanitizedInput = {
//     nombre: req.body.nombre,
//     precio: req.body.precio,
//     ingredientes: req.body.ingredientes,
//     tipoPlato: req.body.tipoPlato,
//     imagen: req.body.imagen,
//   };

//   Object.keys(req.body.sanitizedInput).forEach((key) => {
//     if (req.body.sanitizedInput[key] === undefined) {
//       delete req.body.sanitizedInput[key];
//     }
//   });
//   next();
// }

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await em.find(Plato, {});
    res.status(200).json({ message: "finded all platos", data: pedidos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const pedido = em.create(Plato, req.body);
    await em.flush();
    res.status(201).json({ message: "Plato was created", data: pedido });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pedido = await em.findOneOrFail(Plato, { id });
    res.status(200).json({ message: "found plato", data: pedido });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pedido = em.getReference(Plato, id);
    em.assign(pedido, req.body);
    await em.flush();
    res.status(200).json({ message: "plato updated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pedido = em.getReference(Plato, id);
    await em.removeAndFlush(pedido);
    res.status(200).send({ message: "plato deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
