import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { TipoPlato } from "./tipoPlato.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const tiposPlatos = await em.find(TipoPlato, {});
        res.status(200).json({ message: "finded all types", data: tiposPlatos });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        const tipoPlato = em.create(TipoPlato, req.body);
        await em.flush();
        res.status(201).json({ message: "tipoPlato was created", data: tipoPlato });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoPlato = await em.findOneOrFail(TipoPlato, { id });
        res.status(200).json({ message: "found tipoPlato", data: tipoPlato });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoPlato = em.getReference(TipoPlato, id);
        em.assign(tipoPlato, req.body);
        await em.flush();
        res.status(200).json({ message: "tipoPlato updated" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipoPlato = em.getReference(TipoPlato, id);
        await em.removeAndFlush(tipoPlato);
        res.status(200).send({ message: "tipoPlato deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { findAll, findOne, add, update, remove };
