import { Repository } from "../shared/repository.js";
import { Cliente } from "./clienteEntity.js";
import { db } from "../shared/db.js";

export class ClienteRepository implements Repository<Cliente> {
  findAll(): Cliente[] | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Cliente");
      const rows = stmt.all() as any[];
      
      return rows.map(row => {
        const cliente = new Cliente(
          row.nombre,
          row.apellido,
          row.telefono,
          row.email,
          row.dni
        );
        cliente.id = String(row.id);
        return cliente;
      });
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Cliente | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Cliente WHERE id = ?");
      const row = stmt.get(item.id) as any;
      
      if (!row) return undefined;
      
      const cliente = new Cliente(
        row.nombre,
        row.apellido,
        row.telefono,
        row.email,
        row.dni
      );
      cliente.id = String(row.id);
      return cliente;
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      return undefined;
    }
  }

  add(item: Cliente): Cliente | undefined {
    try {
      const stmt = db.prepare(
        "INSERT INTO Cliente (nombre, apellido, telefono, email, dni) VALUES (?, ?, ?, ?, ?)"
      );
      const result = stmt.run(
        item.nombre,
        item.apellido,
        item.telefono,
        item.email,
        item.dni
      );
      
      item.id = String(result.lastInsertRowid);
      return item;
    } catch (error) {
      console.error("Error al crear cliente:", error);
      return undefined;
    }
  }

  update(item: Cliente): Cliente | undefined {
    try {
      const stmt = db.prepare(
        "UPDATE Cliente SET nombre = ?, apellido = ?, telefono = ?, email = ?, dni = ? WHERE id = ?"
      );
      const result = stmt.run(
        item.nombre,
        item.apellido,
        item.telefono,
        item.email,
        item.dni,
        item.id
      );
      
      if (result.changes === 0) return undefined;
      
      return this.findOne({ id: item.id });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Cliente | undefined {
    try {
      const cliente = this.findOne(item);
      if (!cliente) return undefined;
      
      const stmt = db.prepare("DELETE FROM Cliente WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return cliente;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      return undefined;
    }
  }
}
