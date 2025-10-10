import { Request, Response, NextFunction } from "express";
import { MozoRepository } from "./mozoRepository.sqlite.js";
import { Mozo } from "./mozoEntity.js";

const repository = new MozoRepository();

function sanitizeMozoInput(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    email: req.body.email,
    dni: req.body.dni,
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
  const mozo = repository.findOne({ id: req.params.id });
  if (!mozo) {
    return res.status(404).send({ message: "Mozo no encontrado" });
  }
  return res.json({ data: mozo });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputMozo = new Mozo(
    input.nombre,
    input.apellido,
    input.telefono,
    input.email,
    input.dni
  );
  const nuevoMozo = repository.add(inputMozo);
  return res
    .status(201)
    .send({ message: "Mozo creado exitosamente", data: nuevoMozo });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const mozo = repository.update(req.body.sanitizedInput);
  if (!mozo) {
    return res.status(404).send({ message: "Mozo no encontrado" });
  }
  return res.status(200).send({
    message: "Mozo actualizado exitosamente",
    data: mozo,
  });
}

function remove(req: Request, res: Response) {
  const mozo = repository.delete({ id: req.params.id });
  if (!mozo) {
    return res.status(404).send({ message: "Mozo no encontrado" });
  }
  return res.status(200).send({
    message: "Mozo eliminado exitosamente",
    data: mozo,
  });
}

export { sanitizeMozoInput, findAll, findOne, add, update, remove };
