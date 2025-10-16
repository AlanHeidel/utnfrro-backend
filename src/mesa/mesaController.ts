import { Request, Response, NextFunction } from "express";
import { MesaRepository } from "./mesaRepository.sqlite.js";
import { Mesa } from "./mesaEntity.js";

const repository = new MesaRepository();

function sanitizeMesaInput(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    numero: req.body.numero,
    capacidad: req.body.capacidad,
    estado: req.body.estado,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req: Request, res: Response) {
  const mesa = repository.findOne({ id: req.params.id });
  if (!mesa) {
    return res.status(404).send({ message: "Mesa no encontrada" });
  }
  return res.json({ data: mesa });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputMesa = new Mesa(input.numero, input.capacidad, input.estado);
  const nuevaMesa = repository.add(inputMesa);
  return res
    .status(201)
    .send({ message: "Mesa creada exitosamente", data: nuevaMesa });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const mesa = repository.update(req.body.sanitizedInput);
  if (!mesa) {
    return res.status(404).send({ message: "Mesa no encontrada" });
  }
  return res.status(200).send({
    message: "Mesa actualizada exitosamente",
    data: mesa,
  });
}

function remove(req: Request, res: Response) {
  const mesa = repository.delete({ id: req.params.id });
  if (!mesa) {
    return res.status(404).send({ message: "Mesa no encontrada" });
  }
  return res.status(200).send({
    message: "Mesa eliminada exitosamente",
    data: mesa,
  });
}

export { sanitizeMesaInput, findAll, findOne, add, update, remove };
