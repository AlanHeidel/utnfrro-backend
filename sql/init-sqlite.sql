-- SQLite Database Schema for Restaurant Management System

-- Tabla TipoPlato
CREATE TABLE IF NOT EXISTS TipoPlato (
  idTipoPlato TEXT PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- Tabla Plato
CREATE TABLE IF NOT EXISTS Plato (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  precio REAL NOT NULL,
  ingredientes TEXT NOT NULL, -- guardamos como JSON string
  tipoPlatoId TEXT NOT NULL,
  imagen TEXT,
  FOREIGN KEY (tipoPlatoId) REFERENCES TipoPlato(idTipoPlato)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tabla Mesa
CREATE TABLE IF NOT EXISTS Mesa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero INTEGER NOT NULL UNIQUE,
  capacidad INTEGER NOT NULL,
  estado TEXT CHECK(estado IN ('disponible', 'ocupada', 'reservada')) DEFAULT 'disponible'
);

-- Tabla Cliente
CREATE TABLE IF NOT EXISTS Cliente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  dni TEXT NOT NULL UNIQUE
);

-- Tabla Mozo
CREATE TABLE IF NOT EXISTS Mozo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  dni TEXT NOT NULL UNIQUE
);

-- Tabla Reserva
CREATE TABLE IF NOT EXISTS Reserva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clienteId INTEGER NOT NULL,
  mesaId INTEGER NOT NULL,
  fecha TEXT NOT NULL, -- formato: YYYY-MM-DD
  hora TEXT NOT NULL, -- formato: HH:MM:SS
  cantidadPersonas INTEGER NOT NULL,
  estado TEXT CHECK(estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')) DEFAULT 'pendiente',
  FOREIGN KEY (clienteId) REFERENCES Cliente(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (mesaId) REFERENCES Mesa(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Tabla Pedido
CREATE TABLE IF NOT EXISTS Pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mesaId INTEGER NOT NULL,
  clienteId INTEGER NOT NULL,
  mozoId INTEGER NOT NULL,
  fecha TEXT NOT NULL DEFAULT (datetime('now')), -- formato: YYYY-MM-DD HH:MM:SS
  estado TEXT CHECK(estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')) DEFAULT 'pendiente',
  total REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (mesaId) REFERENCES Mesa(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (clienteId) REFERENCES Cliente(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (mozoId) REFERENCES Mozo(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tabla ItemPedido (relación muchos a muchos entre Pedido y Plato)
CREATE TABLE IF NOT EXISTS ItemPedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedidoId INTEGER NOT NULL,
  platoId INTEGER NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  subtotal REAL NOT NULL,
  FOREIGN KEY (pedidoId) REFERENCES Pedido(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (platoId) REFERENCES Plato(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Tipos de plato (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO TipoPlato (idTipoPlato, nombre) VALUES 
  ('1', 'Entrada'),
  ('2', 'Principal'),
  ('3', 'Postre'),
  ('4', 'Bebida');

-- Platos (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Plato (id, nombre, precio, ingredientes, tipoPlatoId, imagen) VALUES 
  (1, 'Milanesa Napolitana', 1500.00, '["Milanesa", "Queso", "Salsa", "Jamón"]', '2', 'milanesa.jpg'),
  (2, 'Ensalada Caesar', 1200.00, '["Lechuga", "Pollo", "Queso", "Aderezo"]', '1', 'ensalada.jpg'),
  (3, 'Tira de Asado', 2500.00, '["Carne de res", "Sal", "Pimienta"]', '2', 'asado.jpg'),
  (4, 'Flan con Dulce de Leche', 800.00, '["Huevos", "Leche", "Azúcar", "Dulce de leche"]', '3', 'flan.jpg');

-- Mesas (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Mesa (id, numero, capacidad, estado) VALUES 
  (1, 1, 4, 'disponible'),
  (2, 2, 2, 'disponible'),
  (3, 3, 6, 'disponible'),
  (4, 4, 4, 'ocupada'),
  (5, 5, 8, 'reservada');

-- Clientes (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Cliente (id, nombre, apellido, telefono, email, dni) VALUES 
  (1, 'Juan', 'Pérez', '3512345678', 'juan.perez@email.com', '12345678'),
  (2, 'María', 'González', '3519876543', 'maria.gonzalez@email.com', '87654321'),
  (3, 'Carlos', 'Rodríguez', '3515555555', 'carlos.rodriguez@email.com', '11223344');

-- Mozos (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Mozo (id, nombre, apellido, telefono, email, dni) VALUES 
  (1, 'Roberto', 'Fernández', '3517777777', 'roberto.fernandez@restaurante.com', '33445566'),
  (2, 'Laura', 'Sánchez', '3518888888', 'laura.sanchez@restaurante.com', '44556677'),
  (3, 'Diego', 'López', '3516666666', 'diego.lopez@restaurante.com', '55667788');

-- Reservas (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Reserva (id, clienteId, mesaId, fecha, hora, cantidadPersonas, estado) VALUES 
  (1, 1, 5, '2024-12-25', '20:00:00', 4, 'confirmada'),
  (2, 2, 3, '2024-12-24', '19:30:00', 6, 'pendiente');

-- Pedidos (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO Pedido (id, mesaId, clienteId, mozoId, estado, total, fecha) VALUES 
  (1, 4, 3, 1, 'en_preparacion', 4200.00, datetime('now'));

-- Items de pedido (INSERT OR IGNORE para evitar duplicados)
INSERT OR IGNORE INTO ItemPedido (id, pedidoId, platoId, cantidad, subtotal) VALUES 
  (1, 1, 1, 2, 3000.00),
  (2, 1, 2, 1, 1200.00);
