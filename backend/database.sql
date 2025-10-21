-- Esquema de base de datos para Sistema de Gestión de Entregas

CREATE DATABASE IF NOT EXISTS delivery_system;
USE delivery_system;

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de guías de entrega
CREATE TABLE IF NOT EXISTS delivery_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  address TEXT NOT NULL,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  delivery_date DATE,
  delivery_time TIME,
  status ENUM('pending', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
  notes TEXT,
  receipt_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_customer_name (customer_name),
  INDEX idx_created_at (created_at)
);

-- Tabla de comprobantes/receipts
CREATE TABLE IF NOT EXISTS receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  delivery_guide_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (delivery_guide_id) REFERENCES delivery_guides(id) ON DELETE CASCADE,
  INDEX idx_delivery_guide (delivery_guide_id)
);

-- Insertar datos de ejemplo
INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, status) VALUES
('Juan Pérez', 'juan@example.com', '555-0101', 150.00, 'confirmed'),
('María García', 'maria@example.com', '555-0102', 200.00, 'shipped'),
('Carlos López', 'carlos@example.com', '555-0103', 75.50, 'pending'),
('Ana Rodríguez', 'ana@example.com', '555-0104', 300.00, 'delivered');

INSERT INTO delivery_guides (order_id, customer_name, customer_email, customer_phone, address, city, postal_code, status, notes) VALUES
(1, 'Juan Pérez', 'juan@example.com', '555-0101', 'Calle Principal 123', 'Ciudad de México', '01000', 'in_transit', 'Entrega prioritaria'),
(2, 'María García', 'maria@example.com', '555-0102', 'Avenida Central 456', 'Guadalajara', '44100', 'delivered', 'Entrega exitosa'),
(3, 'Carlos López', 'carlos@example.com', '555-0103', 'Plaza Mayor 789', 'Monterrey', '64000', 'pending', 'Cliente no disponible'),
(4, 'Ana Rodríguez', 'ana@example.com', '555-0104', 'Boulevard Reforma 321', 'Puebla', '72000', 'delivered', 'Entrega en oficina');
