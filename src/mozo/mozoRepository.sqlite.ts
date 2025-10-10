import { Repository } from "../shared/repository.js";
import { Mozo } from "./mozoEntity.js";
import { db } from "../shared/db.js";

export class MozoRepository implements Repository<Mozo> {
  findAll(): Mozo[] | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Mozo");
      const rows = stmt.all() as any[];
      
      return rows.map(row => {
        const mozo = new Mozo(
          row.nombre,
          row.apellido,
          row.telefono,
          row.email,
          row.dni
        );
        mozo.id = String(row.id);
        return mozo;
      });
    } catch (error) {
      console.error("Error al obtener mozos:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Mozo | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Mozo WHERE id = ?");
      const row = stmt.get(item.id) as any;
      
      if (!row) return undefined;
      
      const mozo = new Mozo(
        row.nombre,
        row.apellido,
        row.telefono,
        row.email,
        row.dni
      );
      mozo.id = String(row.id);
      return mozo;
    } catch (error) {
      console.error("Error al obtener mozo:", error);
      return undefined;
    }
  }

  add(item: Mozo): Mozo | undefined {
    try {
      const stmt = db.prepare(
        "INSERT INTO Mozo (nombre, apellido, telefono, email, dni) VALUES (?, ?, ?, ?, ?)"
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
      console.error("Error al crear mozo:", error);
      return undefined;
    }
  }

  update(item: Mozo): Mozo | undefined {
    try {
      const stmt = db.prepare(
        "UPDATE Mozo SET nombre = ?, apellido = ?, telefono = ?, email = ?, dni = ? WHERE id = ?"
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
      console.error("Error al actualizar mozo:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Mozo | undefined {
    try {
      const mozo = this.findOne(item);
      if (!mozo) return undefined;
      
      const stmt = db.prepare("DELETE FROM Mozo WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return mozo;
    } catch (error) {
      console.error("Error al eliminar mozo:", error);
      return undefined;
    }
  }
}
