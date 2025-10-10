import { Repository } from "../shared/repository.js";
import { Mesa } from "./mesaEntity.js";
import { db } from "../shared/db.js";

export class MesaRepository implements Repository<Mesa> {
  findAll(): Mesa[] | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Mesa");
      const rows = stmt.all() as any[];
      
      return rows.map(row => {
        const mesa = new Mesa(row.numero, row.capacidad, row.estado);
        mesa.id = String(row.id);
        return mesa;
      });
    } catch (error) {
      console.error("Error al obtener mesas:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Mesa | undefined {
    try {
      const stmt = db.prepare("SELECT * FROM Mesa WHERE id = ?");
      const row = stmt.get(item.id) as any;
      
      if (!row) return undefined;
      
      const mesa = new Mesa(row.numero, row.capacidad, row.estado);
      mesa.id = String(row.id);
      return mesa;
    } catch (error) {
      console.error("Error al obtener mesa:", error);
      return undefined;
    }
  }

  add(item: Mesa): Mesa | undefined {
    try {
      const stmt = db.prepare(
        "INSERT INTO Mesa (numero, capacidad, estado) VALUES (?, ?, ?)"
      );
      const result = stmt.run(item.numero, item.capacidad, item.estado);
      
      item.id = String(result.lastInsertRowid);
      return item;
    } catch (error) {
      console.error("Error al crear mesa:", error);
      return undefined;
    }
  }

  update(item: Mesa): Mesa | undefined {
    try {
      const stmt = db.prepare(
        "UPDATE Mesa SET numero = ?, capacidad = ?, estado = ? WHERE id = ?"
      );
      const result = stmt.run(item.numero, item.capacidad, item.estado, item.id);
      
      if (result.changes === 0) return undefined;
      
      return this.findOne({ id: item.id });
    } catch (error) {
      console.error("Error al actualizar mesa:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Mesa | undefined {
    try {
      const mesa = this.findOne(item);
      if (!mesa) return undefined;
      
      const stmt = db.prepare("DELETE FROM Mesa WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return mesa;
    } catch (error) {
      console.error("Error al eliminar mesa:", error);
      return undefined;
    }
  }
}
