import { Request, Response, NextFunction } from "express";
import { ReservaRepository } from "./reservaRepository.sqlite.js";
import { Reserva } from "./reservaEntity.js";

const repository = new ReservaRepository();

function sanitizeReservaInput(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cliente: req.body.cliente,
    mesa: req.body.mesa,
    fecha: req.body.fecha,
    hora: req.body.hora,
    cantidadPersonas: req.body.cantidadPersonas,
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
  const reserva = repository.findOne({ id: req.params.id });
  if (!reserva) {
    return res.status(404).send({ message: "Reserva no encontrada" });
  }
  return res.json({ data: reserva });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputReserva = new Reserva(
    input.cliente,
    input.mesa,
    input.fecha,
    input.hora,
    input.cantidadPersonas,
    input.estado
  );
  const nuevaReserva = repository.add(inputReserva);
  return res
    .status(201)
    .send({ message: "Reserva creada exitosamente", data: nuevaReserva });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const reserva = repository.update(req.body.sanitizedInput);
  if (!reserva) {
    return res.status(404).send({ message: "Reserva no encontrada" });
  }
  return res.status(200).send({
    message: "Reserva actualizada exitosamente",
    data: reserva,
  });
}

function remove(req: Request, res: Response) {
  const reserva = repository.delete({ id: req.params.id });
  if (!reserva) {
    return res.status(404).send({ message: "Reserva no encontrada" });
  }
  return res.status(200).send({
    message: "Reserva eliminada exitosamente",
    data: reserva,
  });
}

export { sanitizeReservaInput, findAll, findOne, add, update, remove };
