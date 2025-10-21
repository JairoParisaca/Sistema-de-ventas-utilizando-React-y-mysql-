-- Database schema for Delivery Management System

CREATE DATABASE IF NOT EXISTS delivery_system;
USE delivery_system;

-- Orders table
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

-- Delivery guides table
CREATE TABLE IF NOT EXISTS delivery_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  customer_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  status ENUM('pending', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
  receipt_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, status) VALUES
('Juan Pérez', 'juan@example.com', '555-0101', 150.00, 'confirmed'),
('María García', 'maria@example.com', '555-0102', 200.00, 'shipped'),
('Carlos López', 'carlos@example.com', '555-0103', 75.50, 'pending');

INSERT INTO delivery_guides (order_id, customer_name, address, status) VALUES
(1, 'Juan Pérez', 'Calle Principal 123, Ciudad', 'in_transit'),
(2, 'María García', 'Avenida Central 456, Ciudad', 'delivered'),
(3, 'Carlos López', 'Plaza Mayor 789, Ciudad', 'pending');
