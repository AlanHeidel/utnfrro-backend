import { Request, Response, NextFunction } from "express";
import { PedidoRepository } from "./pedidoRepository.sqlite.js";
import { Pedido } from "./pedidoEntity.js";

const repository = new PedidoRepository();

function sanitizePedidoInput(req: Request, _: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    mesa: req.body.mesa,
    cliente: req.body.cliente,
    mozo: req.body.mozo,
    items: req.body.items,
    fecha: req.body.fecha,
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
  const pedido = repository.findOne({ id: req.params.id });
  if (!pedido) {
    return res.status(404).send({ message: "Pedido no encontrado" });
  }
  return res.json({ data: pedido });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const inputPedido = new Pedido(
    input.mesa,
    input.cliente,
    input.mozo,
    input.items,
    input.estado
  );
  const nuevoPedido = repository.add(inputPedido);
  return res
    .status(201)
    .send({ message: "Pedido creado exitosamente", data: nuevoPedido });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const pedido = repository.update(req.body.sanitizedInput);
  if (!pedido) {
    return res.status(404).send({ message: "Pedido no encontrado" });
  }
  return res.status(200).send({
    message: "Pedido actualizado exitosamente",
    data: pedido,
  });
}

function remove(req: Request, res: Response) {
  const pedido = repository.delete({ id: req.params.id });
  if (!pedido) {
    return res.status(404).send({ message: "Pedido no encontrado" });
  }
  return res.status(200).send({
    message: "Pedido eliminado exitosamente",
    data: pedido,
  });
}

export { sanitizePedidoInput, findAll, findOne, add, update, remove };
