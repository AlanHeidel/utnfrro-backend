import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Mesa } from "./mesa.entity.js";
import { tableAccountService } from "../tableAccount/tableAccount.service.js";
import { NotFoundError } from "@mikro-orm/core";
import { Mozo } from "../mozo/mozo.entity.js";

const em = orm.em;
const DEFAULT_TABLE_PASS = process.env.TABLE_DEFAULT_PASS || "mesa-pass";

async function findAll(req: Request, res: Response) {
  try {
    const mesas = await em.find(
      Mesa,
      { deleted: false },
      { populate: ["mozo"] },
    );
    res.status(200).json({ message: "finded all mesas", data: mesas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const { mozoId, numeroMesa, ...rest } = req.body;
    // Verificar si existe mesa con el mismo numeroMesa (incluso si está eliminada)
    const existing = await em.findOne(Mesa, { numeroMesa });
    if (existing && !existing.deleted) {
      return res.status(409).json({ message: "mesa number already exists" });
    }
    let mesa: Mesa;
    if (existing && existing.deleted) {
      // Asignar datos nuevos y restaurar mesa eliminada (deleted: false)
      mesa = existing;
      em.assign(mesa, { ...rest, numeroMesa, deleted: false });

      if (mozoId) {
        mesa.mozo = em.getReference(Mozo, mozoId);
      } else {
        mesa.mozo = null;
      }
      await em.flush();
      return res.status(200).json({ message: "Mesa restored", data: mesa });
    }

    // Crear nueva desde cero
    mesa = em.create(Mesa, { ...rest, numeroMesa });
    if (mozoId) {
      mesa.mozo = em.getReference(Mozo, mozoId);
    }
    await em.flush();

    const plainPassword = DEFAULT_TABLE_PASS;
    const identifier = `mesa-${mesa.numeroMesa ?? mesa.id}`;
    const tableAccount = await tableAccountService.create({
      mesaId: mesa.id,
      password: plainPassword,
      identifier,
    });

    res.status(201).json({
      message: "Mesa creada y cuenta de mesa lista",
      data: {
        mesa,
        tableAccount: {
          identifier: tableAccount.identifier,
          password: plainPassword,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mesa = await em.findOneOrFail(
      Mesa,
      { id, deleted: false },
      { populate: ["mozo"] },
    );
    res.status(200).json({ message: "found mesa", data: mesa });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mesa not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

// async function update(req: Request, res: Response) {
//   try {
//     const id = Number.parseInt(req.params.id);
//     const mesa = await em.findOneOrFail(Mesa, { id, deleted: false });
//     em.assign(mesa, req.body);
//     await em.flush();
//     res.status(200).json({ message: "mesa updated" });
//   } catch (error: any) {
//     if (error instanceof NotFoundError) {
//       return res.status(404).json({ message: "mesa not found" });
//     }
//     res.status(500).json({ message: error.message });
//   }
// }

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mesa = await em.findOneOrFail(Mesa, { id, deleted: false });

    const { mozoId, ...rest } = req.body;
    em.assign(mesa, rest);

    if (mozoId) {
      mesa.mozo = em.getReference(Mozo, mozoId);
    } else {
      mesa.mozo = null;
    }

    await em.flush();
    res.status(200).json({ message: "mesa updated" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mesa not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mesa = await em.findOneOrFail(Mesa, { id, deleted: false });
    mesa.deleted = true;
    await em.flush();
    res.status(200).send({ message: "mesa deleted" });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "mesa not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
