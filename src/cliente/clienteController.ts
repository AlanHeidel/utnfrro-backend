import { Request, Response, NextFunction } from "express";
import { ClienteRepository } from "./clienteRepository.sqlite.js";
import { Cliente } from "./clienteEntity.js";

const repository = new ClienteRepository();

function sanitizeClienteInput(req: Request, _: Response, next: NextFunction) {
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
  const cliente = repository.findOne({ id: req.params.id });
  if (!cliente) {
    return res.status(404).send({ message: "Cliente no encontrado" });
  }
  return res.json({ data: cliente });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputCliente = new Cliente(
    input.nombre,
    input.apellido,
    input.telefono,
    input.email,
    input.dni
  );
  const nuevoCliente = repository.add(inputCliente);
  return res
    .status(201)
    .send({ message: "Cliente creado exitosamente", data: nuevoCliente });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const cliente = repository.update(req.body.sanitizedInput);
  if (!cliente) {
    return res.status(404).send({ message: "Cliente no encontrado" });
  }
  return res.status(200).send({
    message: "Cliente actualizado exitosamente",
    data: cliente,
  });
}

function remove(req: Request, res: Response) {
  const cliente = repository.delete({ id: req.params.id });
  if (!cliente) {
    return res.status(404).send({ message: "Cliente no encontrado" });
  }
  return res.status(200).send({
    message: "Cliente eliminado exitosamente",
    data: cliente,
  });
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove };
