import { Repository } from "../shared/repository.js";
import { Pedido, ItemPedido } from "./pedidoEntity.js";
import { Cliente } from "../cliente/clienteEntity.js";
import { Mesa } from "../mesa/mesaEntity.js";
import { Mozo } from "../mozo/mozoEntity.js";
import { Plato, TipoPlato } from "../plato/platoEntity.js";
import { db } from "../shared/db.js";

export class PedidoRepository implements Repository<Pedido> {
  findAll(): Pedido[] | undefined {
    try {
      const stmt = db.prepare(`
        SELECT 
          p.*,
          c.id as clienteId, c.nombre as clienteNombre, c.apellido as clienteApellido,
          c.telefono as clienteTelefono, c.email as clienteEmail, c.dni as clienteDni,
          m.id as mesaId, m.numero as mesaNumero, m.capacidad as mesaCapacidad, m.estado as mesaEstado,
          mo.id as mozoId, mo.nombre as mozoNombre, mo.apellido as mozoApellido,
          mo.telefono as mozoTelefono, mo.email as mozoEmail, mo.dni as mozoDni
        FROM Pedido p
        JOIN Cliente c ON p.clienteId = c.id
        JOIN Mesa m ON p.mesaId = m.id
        JOIN Mozo mo ON p.mozoId = mo.id
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
        
        const mozo = new Mozo(
          row.mozoNombre,
          row.mozoApellido,
          row.mozoTelefono,
          row.mozoEmail,
          row.mozoDni
        );
        mozo.id = String(row.mozoId);
        
        // Obtener items del pedido
        const items = this.getItemsPedido(String(row.id));
        
        const pedido = new Pedido(
          mesa,
          cliente,
          mozo,
          items,
          row.estado
        );
        pedido.fecha = row.fecha;
        pedido.id = String(row.id);
        return pedido;
      });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      return undefined;
    }
  }

  findOne(item: { id: string }): Pedido | undefined {
    try {
      const stmt = db.prepare(`
        SELECT 
          p.*,
          c.id as clienteId, c.nombre as clienteNombre, c.apellido as clienteApellido,
          c.telefono as clienteTelefono, c.email as clienteEmail, c.dni as clienteDni,
          m.id as mesaId, m.numero as mesaNumero, m.capacidad as mesaCapacidad, m.estado as mesaEstado,
          mo.id as mozoId, mo.nombre as mozoNombre, mo.apellido as mozoApellido,
          mo.telefono as mozoTelefono, mo.email as mozoEmail, mo.dni as mozoDni
        FROM Pedido p
        JOIN Cliente c ON p.clienteId = c.id
        JOIN Mesa m ON p.mesaId = m.id
        JOIN Mozo mo ON p.mozoId = mo.id
        WHERE p.id = ?
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
      
      const mozo = new Mozo(
        row.mozoNombre,
        row.mozoApellido,
        row.mozoTelefono,
        row.mozoEmail,
        row.mozoDni
      );
      mozo.id = String(row.mozoId);
      
      // Obtener items del pedido
      const items = this.getItemsPedido(String(row.id));
      
      const pedido = new Pedido(
        mesa,
        cliente,
        mozo,
        items,
        row.estado
      );
      pedido.fecha = row.fecha;
      pedido.id = String(row.id);
      return pedido;
    } catch (error) {
      console.error("Error al obtener pedido:", error);
      return undefined;
    }
  }

  private getItemsPedido(pedidoId: string): ItemPedido[] {
    try {
      const stmt = db.prepare(`
        SELECT 
          ip.*,
          pl.id as platoId, pl.nombre as platoNombre, pl.precio as platoPrecio,
          pl.ingredientes as platoIngredientes, pl.imagen as platoImagen,
          tp.idTipoPlato, tp.nombre as tipoNombre
        FROM ItemPedido ip
        JOIN Plato pl ON ip.platoId = pl.id
        JOIN TipoPlato tp ON pl.tipoPlatoId = tp.idTipoPlato
        WHERE ip.pedidoId = ?
      `);
      const rows = stmt.all(pedidoId) as any[];
      
      return rows.map(row => {
        const tipoPlato = new TipoPlato(row.idTipoPlato, row.tipoNombre);
        const ingredientes = JSON.parse(row.platoIngredientes);
        const plato = new Plato(
          row.platoNombre,
          row.platoPrecio,
          ingredientes,
          tipoPlato,
          row.platoImagen
        );
        plato.id = String(row.platoId);
        
        return {
          plato,
          cantidad: row.cantidad,
          subtotal: row.subtotal
        };
      });
    } catch (error) {
      console.error("Error al obtener items del pedido:", error);
      return [];
    }
  }

  add(item: Pedido): Pedido | undefined {
    try {
      // Iniciar transacción
      const insertPedido = db.prepare(
        "INSERT INTO Pedido (mesaId, clienteId, mozoId, fecha, estado, total) VALUES (?, ?, ?, ?, ?, ?)"
      );
      
      const result = insertPedido.run(
        item.mesa.id,
        item.cliente.id,
        item.mozo.id,
        item.fecha,
        item.estado,
        item.total
      );
      
      const pedidoId = String(result.lastInsertRowid);
      item.id = pedidoId;
      
      // Insertar items del pedido
      const insertItem = db.prepare(
        "INSERT INTO ItemPedido (pedidoId, platoId, cantidad, subtotal) VALUES (?, ?, ?, ?)"
      );
      
      for (const itemPedido of item.items) {
        insertItem.run(
          pedidoId,
          itemPedido.plato.id,
          itemPedido.cantidad,
          itemPedido.subtotal
        );
      }
      
      return item;
    } catch (error) {
      console.error("Error al crear pedido:", error);
      return undefined;
    }
  }

  update(item: Pedido): Pedido | undefined {
    try {
      // Actualizar pedido
      const updatePedido = db.prepare(
        "UPDATE Pedido SET mesaId = ?, clienteId = ?, mozoId = ?, fecha = ?, estado = ?, total = ? WHERE id = ?"
      );
      
      const result = updatePedido.run(
        item.mesa.id,
        item.cliente.id,
        item.mozo.id,
        item.fecha,
        item.estado,
        item.total,
        item.id
      );
      
      if (result.changes === 0) return undefined;
      
      // Eliminar items anteriores
      const deleteItems = db.prepare("DELETE FROM ItemPedido WHERE pedidoId = ?");
      deleteItems.run(item.id);
      
      // Insertar nuevos items
      const insertItem = db.prepare(
        "INSERT INTO ItemPedido (pedidoId, platoId, cantidad, subtotal) VALUES (?, ?, ?, ?)"
      );
      
      for (const itemPedido of item.items) {
        insertItem.run(
          item.id,
          itemPedido.plato.id,
          itemPedido.cantidad,
          itemPedido.subtotal
        );
      }
      
      return this.findOne({ id: item.id });
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      return undefined;
    }
  }

  delete(item: { id: string }): Pedido | undefined {
    try {
      const pedido = this.findOne(item);
      if (!pedido) return undefined;
      
      // Los items se eliminan automáticamente por CASCADE
      const stmt = db.prepare("DELETE FROM Pedido WHERE id = ?");
      const result = stmt.run(item.id);
      
      if (result.changes === 0) return undefined;
      
      return pedido;
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      return undefined;
    }
  }
}
