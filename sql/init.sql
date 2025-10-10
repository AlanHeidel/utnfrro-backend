CREATE DATABASE IF NOT EXISTS restaurantDB;

USE restaurantDB;

-- Tabla TipoPlato
CREATE TABLE IF NOT EXISTS TipoPlato (
  idTipoPlato VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- Tabla Plato
CREATE TABLE IF NOT EXISTS Plato (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  ingredientes TEXT NOT NULL, -- guardamos como JSON o string separado por comas
  tipoPlatoId VARCHAR(50) NOT NULL,
  imagen VARCHAR(255),
  CONSTRAINT fk_tipoPlato
    FOREIGN KEY (tipoPlatoId)
    REFERENCES TipoPlato(idTipoPlato)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tabla Mesa
CREATE TABLE IF NOT EXISTS Mesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  capacidad INT NOT NULL,
  estado ENUM('disponible', 'ocupada', 'reservada') DEFAULT 'disponible'
);

-- Tabla Cliente
CREATE TABLE IF NOT EXISTS Cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  dni VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla Mozo
CREATE TABLE IF NOT EXISTS Mozo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  dni VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla Reserva
CREATE TABLE IF NOT EXISTS Reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT NOT NULL,
  mesaId INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  cantidadPersonas INT NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
  CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (clienteId)
    REFERENCES Cliente(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reserva_mesa
    FOREIGN KEY (mesaId)
    REFERENCES Mesa(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Tabla Pedido
CREATE TABLE IF NOT EXISTS Pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesaId INT NOT NULL,
  clienteId INT NOT NULL,
  mozoId INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_pedido_mesa
    FOREIGN KEY (mesaId)
    REFERENCES Mesa(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (clienteId)
    REFERENCES Cliente(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_mozo
    FOREIGN KEY (mozoId)
    REFERENCES Mozo(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tabla ItemPedido (relación muchos a muchos entre Pedido y Plato)
CREATE TABLE IF NOT EXISTS ItemPedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedidoId INT NOT NULL,
  platoId INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_item_pedido
    FOREIGN KEY (pedidoId)
    REFERENCES Pedido(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_item_plato
    FOREIGN KEY (platoId)
    REFERENCES Plato(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Tipos de plato
INSERT INTO TipoPlato (idTipoPlato, nombre) VALUES 
  ('1', 'Entrada'),
  ('2', 'Principal'),
  ('3', 'Postre'),
  ('4', 'Bebida');

-- Platos
INSERT INTO Plato (nombre, precio, ingredientes, tipoPlatoId, imagen) VALUES 
  ('Milanesa Napolitana', 1500.00, 'Milanesa, Queso, Salsa, Jamón', '2', 'milanesa.jpg'),
  ('Ensalada Caesar', 1200.00, 'Lechuga, Pollo, Queso, Aderezo', '1', 'ensalada.jpg'),
  ('Tira de Asado', 2500.00, 'Carne de res, Sal, Pimienta', '2', 'asado.jpg'),
  ('Flan con Dulce de Leche', 800.00, 'Huevos, Leche, Azúcar, Dulce de leche', '3', 'flan.jpg');

-- Mesas
INSERT INTO Mesa (numero, capacidad, estado) VALUES 
  (1, 4, 'disponible'),
  (2, 2, 'disponible'),
  (3, 6, 'disponible'),
  (4, 4, 'ocupada'),
  (5, 8, 'reservada');

-- Clientes
INSERT INTO Cliente (nombre, apellido, telefono, email, dni) VALUES 
  ('Juan', 'Pérez', '3512345678', 'juan.perez@email.com', '12345678'),
  ('María', 'González', '3519876543', 'maria.gonzalez@email.com', '87654321'),
  ('Carlos', 'Rodríguez', '3515555555', 'carlos.rodriguez@email.com', '11223344');

-- Mozos
INSERT INTO Mozo (nombre, apellido, telefono, email, dni) VALUES 
  ('Roberto', 'Fernández', '3517777777', 'roberto.fernandez@restaurante.com', '33445566'),
  ('Laura', 'Sánchez', '3518888888', 'laura.sanchez@restaurante.com', '44556677'),
  ('Diego', 'López', '3516666666', 'diego.lopez@restaurante.com', '55667788');

-- Reservas
INSERT INTO Reserva (clienteId, mesaId, fecha, hora, cantidadPersonas, estado) VALUES 
  (1, 5, '2024-12-25', '20:00:00', 4, 'confirmada'),
  (2, 3, '2024-12-24', '19:30:00', 6, 'pendiente');

-- Pedidos
INSERT INTO Pedido (mesaId, clienteId, mozoId, estado, total) VALUES 
  (4, 3, 1, 'en_preparacion', 4200.00);

-- Items de pedido
INSERT INTO ItemPedido (pedidoId, platoId, cantidad, subtotal) VALUES 
  (1, 1, 2, 3000.00),
  (1, 2, 1, 1200.00);
