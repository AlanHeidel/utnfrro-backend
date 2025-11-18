import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Mesa } from "./mesa.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const mesas = await em.find(Mesa, {}, { populate: ["mozo"] });
        res.status(200).json({ message: "finded all mesas", data: mesas });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        const mesa = em.create(Mesa, req.body);
        await em.flush();
        res.status(201).json({ message: "Mesa was created", data: mesa });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const mesa = await em.findOneOrFail(Mesa, { id }, { populate: ["mozo"] });
        res.status(200).json({ message: "found mesa", data: mesa });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const mesa = em.getReference(Mesa, id);
        em.assign(mesa, req.body);
        await em.flush();
        res.status(200).json({ message: "mesa updated" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const mesa = em.getReference(Mesa, id);
        await em.removeAndFlush(mesa);
        res.status(200).send({ message: "mesa deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { findAll, findOne, add, update, remove };
