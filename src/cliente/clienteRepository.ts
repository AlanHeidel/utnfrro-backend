import { Repository } from "../shared/repository.js";
import { Cliente } from "./clienteEntity.js";

const clientes = [
  new Cliente(
    "Juan",
    "Pérez",
    "3512345678",
    "juan.perez@email.com",
    "12345678"
  ),
  new Cliente(
    "María",
    "González",
    "3519876543",
    "maria.gonzalez@email.com",
    "87654321"
  ),
  new Cliente(
    "Carlos",
    "Rodríguez",
    "3515555555",
    "carlos.rodriguez@email.com",
    "11223344"
  ),
];

export class ClienteRepository implements Repository<Cliente> {
  findAll(): Cliente[] | undefined {
    return clientes;
  }

  findOne(item: { id: string }): Cliente | undefined {
    return clientes.find((c) => c.id === item.id);
  }

  add(item: Cliente): Cliente | undefined {
    clientes.push(item);
    return item;
  }

  update(item: Cliente): Cliente | undefined {
    const clienteIdx = clientes.findIndex((c) => c.id === item.id);
    if (clienteIdx !== -1) {
      clientes[clienteIdx] = { ...clientes[clienteIdx], ...item };
    }
    return clientes[clienteIdx];
  }

  delete(item: { id: string }): Cliente | undefined {
    const clienteIdx = clientes.findIndex((c) => c.id === item.id);
    if (clienteIdx !== -1) {
      const deletedCliente = clientes[clienteIdx];
      clientes.splice(clienteIdx, 1);
      return deletedCliente;
    }
  }
}
