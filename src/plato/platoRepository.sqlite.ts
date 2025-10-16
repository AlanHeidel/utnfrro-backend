import { Repository } from "../shared/repository.js";
import { Plato, TipoPlato } from "./platoEntity.js";
import { db } from "../shared/db.js";

export class PlatoRepository implements Repository<Plato> {
  findAll(): Plato[] | undefined {
    try {
      const stmt = db.prepare(`
        SELECT p.*, tp.idTipoPlato, tp.nombre as tipoNombre 
        FROM Plato p 
        JOIN TipoPlato tp ON p.tipoPlatoId = tp.idTipoPlato
      `);
      const rows = stmt.all() as any[];
      
      return rows.map(row => {
        const tipoPlato = new TipoPlato(row.idTipoPlato, row.tipoNombre);
        const ingredientes = JSON.parse(row.ingredientes);
        const plato = new Plato(
          row.nombre,
          row.precio,
          ingredientes,
          tipoPlato,
          row.imagen
        );
        plato.id = String(row.id);
        return plato;
      });
    } catch (error) {
      console.error("Error al obtener platos:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Plato | undefined {
    try {
      const stmt = db.prepare(`
        SELECT p.*, tp.idTipoPlato, tp.nombre as tipoNombre 
        FROM Plato p 
        JOIN TipoPlato tp ON p.tipoPlatoId = tp.idTipoPlato
        WHERE p.id = ?
      `);
      const row = stmt.get(item.id) as any;
      
      if (!row) return undefined;
      
      const tipoPlato = new TipoPlato(row.idTipoPlato, row.tipoNombre);
      const ingredientes = JSON.parse(row.ingredientes);
      const plato = new Plato(
        row.nombre,
        row.precio,
        ingredientes,
        tipoPlato,
        row.imagen
      );
      plato.id = String(row.id);
      return plato;
    } catch (error) {
      console.error("Error al obtener plato:", error);
      return undefined;
    }
  }

  add(item: Plato): Plato | undefined {
    try {
      const ingredientesJson = JSON.stringify(item.ingredientes);
      const stmt = db.prepare(
        "INSERT INTO Plato (nombre, precio, ingredientes, tipoPlatoId, imagen) VALUES (?, ?, ?, ?, ?)"
      );
      const result = stmt.run(
        item.nombre,
        item.precio,
        ingredientesJson,
        item.tipoPlato.idTipoPlato,
        item.imagen
      );
      
      item.id = String(result.lastInsertRowid);
      return item;
    } catch (error) {
      console.error("Error al crear plato:", error);
      return undefined;
    }
  }

  update(item: Plato): Plato | undefined {
    try {
      const ingredientesJson = JSON.stringify(item.ingredientes);
      const stmt = db.prepare(
        "UPDATE Plato SET nombre = ?, precio = ?, ingredientes = ?, tipoPlatoId = ?, imagen = ? WHERE id = ?"
      );
      const result = stmt.run(
        item.nombre,
        item.precio,
        ingredientesJson,
        item.tipoPlato.idTipoPlato,
        item.imagen,
        item.id
      );
      
      if (result.changes === 0) return undefined;
      
      return this.findOne({ id: item.id });
    } catch (error) {
      console.error("Error al actualizar plato:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Plato | undefined {
    try {
      const plato = this.findOne(item);
      if (!plato) return undefined;
      
      const stmt = db.prepare("DELETE FROM Plato WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return plato;
    } catch (error) {
      console.error("Error al eliminar plato:", error);
      return undefined;
    }
  }
}
