import { Repository } from "../shared/repository.js";
import { Reserva } from "./reservaEntity.js";
import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa } from "../mesa/mesaEntity.js";
import { db } from "../shared/db.js";

export class ReservaRepository implements Repository<Reserva> {
  findAll(): Reserva[] | undefined {
    try {
      const stmt = db.prepare(`
        SELECT 
          r.*,
          c.id as clienteId, c.nombre as clienteNombre, c.apellido as clienteApellido,
          c.telefono as clienteTelefono, c.email as clienteEmail, c.dni as clienteDni,
          m.id as mesaId, m.numero as mesaNumero, m.capacidad as mesaCapacidad, m.estado as mesaEstado
        FROM Reserva r
        JOIN Cliente c ON r.clienteId = c.id
        JOIN Mesa m ON r.mesaId = m.id
      `);
      const rows = stmt.all() as any[];
      
      return rows.map(row => {
        const cliente = new Cliente(
          row.clienteNombre,
          row.clienteApellido,
          row.clienteTelefono,
          row.clienteEmail,
          row.clienteDni
        );
        cliente.id = String(row.clienteId);
        
        const mesa = new Mesa(row.mesaNumero, row.mesaCapacidad, row.mesaEstado);
        mesa.id = String(row.mesaId);
        
        const reserva = new Reserva(
          cliente,
          mesa,
          row.fecha,
          row.hora,
          row.cantidadPersonas,
          row.estado
        );
        reserva.id = String(row.id);
        return reserva;
      });
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Reserva | undefined {
    try {
      const stmt = db.prepare(`
        SELECT 
          r.*,
          c.id as clienteId, c.nombre as clienteNombre, c.apellido as clienteApellido,
          c.telefono as clienteTelefono, c.email as clienteEmail, c.dni as clienteDni,
          m.id as mesaId, m.numero as mesaNumero, m.capacidad as mesaCapacidad, m.estado as mesaEstado
        FROM Reserva r
        JOIN Cliente c ON r.clienteId = c.id
        JOIN Mesa m ON r.mesaId = m.id
        WHERE r.id = ?
      `);
      const row = stmt.get(item.id) as any;
      
      if (!row) return undefined;
      
      const cliente = new Cliente(
        row.clienteNombre,
        row.clienteApellido,
        row.clienteTelefono,
        row.clienteEmail,
        row.clienteDni
      );
      cliente.id = String(row.clienteId);
      
      const mesa = new Mesa(row.mesaNumero, row.mesaCapacidad, row.mesaEstado);
      mesa.id = String(row.mesaId);
      
      const reserva = new Reserva(
        cliente,
        mesa,
        row.fecha,
        row.hora,
        row.cantidadPersonas,
        row.estado
      );
      reserva.id = String(row.id);
      return reserva;
    } catch (error) {
      console.error("Error al obtener reserva:", error);
      return undefined;
    }
  }

  add(item: Reserva): Reserva | undefined {
    try {
      const stmt = db.prepare(
        "INSERT INTO Reserva (clienteId, mesaId, fecha, hora, cantidadPersonas, estado) VALUES (?, ?, ?, ?, ?, ?)"
      );
      const result = stmt.run(
        item.cliente.id,
        item.mesa.id,
        item.fecha,
        item.hora,
        item.cantidadPersonas,
        item.estado
      );
      
      item.id = String(result.lastInsertRowid);
      return item;
    } catch (error) {
      console.error("Error al crear reserva:", error);
      return undefined;
    }
  }

  update(item: Reserva): Reserva | undefined {
    try {
      const stmt = db.prepare(
        "UPDATE Reserva SET clienteId = ?, mesaId = ?, fecha = ?, hora = ?, cantidadPersonas = ?, estado = ? WHERE id = ?"
      );
      const result = stmt.run(
        item.cliente.id,
        item.mesa.id,
        item.fecha,
        item.hora,
        item.cantidadPersonas,
        item.estado,
        item.id
      );
      
      if (result.changes === 0) return undefined;
      
      return this.findOne({ id: item.id });
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Reserva | undefined {
    try {
      const reserva = this.findOne(item);
      if (!reserva) return undefined;
      
      const stmt = db.prepare("DELETE FROM Reserva WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return reserva;
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      return undefined;
    }
  }
}
