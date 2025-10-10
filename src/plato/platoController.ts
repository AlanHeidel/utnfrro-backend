import { Request, Response, NextFunction } from "express";
import { PlatoRepository } from "./platoRepository.sqlite.js";
import { Plato } from "./platoEntity.js";

const repository = new PlatoRepository();

function sanitizePlatoInput(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    precio: req.body.precio,
    ingredientes: req.body.ingredientes,
    tipoPlato: req.body.tipoPlato,
    imagen: req.body.imagen,
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
  const plato = repository.findOne({ id: req.params.id });
  if (!plato) {
    return res.status(404).send("Plato not found");
  }
  return res.json({ data: plato });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputPlato = new Plato(
    input.nombre,
    input.precio,
    input.ingredientes,
    input.tipoPlato,
    input.imagen
  );
  const nuevoPlato = repository.add(inputPlato);
  return res
    .status(201)
    .send({ message: "Plato creado exitosamente", data: nuevoPlato });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const plato = repository.update(req.body.sanitizedInput);
  if (!plato) {
    return res.status(404).send("Plato not found");
  }
  return res.status(201).send({
    message: "Plato actualizado exitosamente",
    data: plato,
  });
}

function remove(req: Request, res: Response) {
  const plato = repository.delete({ id: req.params.id });
  if (!plato) {
    return res.status(404).send("Plato not found");
  }
  return res.status(200).send({
    message: "Plato eliminado exitosamente",
    data: plato,
  });
}

export { sanitizePlatoInput, findAll, findOne, add, update, remove };
