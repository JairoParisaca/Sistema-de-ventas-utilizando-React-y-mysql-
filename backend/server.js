const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0402',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create database and tables
  db.query('CREATE DATABASE IF NOT EXISTS delivery_system', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    db.query('USE delivery_system', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      }
      console.log('Connected to MySQL database');

      // Create tables
      const createOrdersTable = `
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
      `;

      const createDeliveryGuidesTable = `
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
      `;

      const createReceiptsTable = `
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
      `;

      db.query(createOrdersTable, (err) => {
        if (err) {
          console.error('Error creating orders table:', err);
        } else {
          console.log('Orders table created or already exists');
          db.query(createDeliveryGuidesTable, (err) => {
            if (err) {
              console.error('Error creating delivery_guides table:', err);
            } else {
              console.log('Delivery guides table created or already exists');
              db.query(createReceiptsTable, (err) => {
                if (err) {
                  console.error('Error creating receipts table:', err);
                } else {
                  console.log('Receipts table created or already exists');
                }
              });
            }
          });
        }
      });


    });
  });
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
// Get all delivery guides
app.get('/api/delivery-guides', (req, res) => {
  const query = 'SELECT * FROM delivery_guides ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get delivery guide by ID
app.get('/api/delivery-guides/:id', (req, res) => {
  const query = 'SELECT * FROM delivery_guides WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Delivery guide not found' });
    res.json(results[0]);
  });
});

// Create new delivery guide
app.post('/api/delivery-guides', upload.single('receipt'), (req, res) => {
  const {
    order_id,
    customer_name,
    customer_email,
    customer_phone,
    address,
    city,
    postal_code,
    delivery_date,
    delivery_time,
    status,
    notes
  } = req.body;

  // Parse delivery_date to YYYY-MM-DD format if provided
  let formattedDate = null;
  if (delivery_date) {
    try {
      const date = new Date(delivery_date);
      formattedDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    } catch (error) {
      console.error('Error parsing delivery_date:', error);
    }
  }

  const receiptPath = req.file ? req.file.filename : null;

  const query = `INSERT INTO delivery_guides
    (order_id, customer_name, customer_email, customer_phone, address, city, postal_code, delivery_date, delivery_time, status, notes, receipt_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    order_id || null,
    customer_name,
    customer_email || null,
    customer_phone || null,
    address,
    city || null,
    postal_code || null,
    formattedDate,
    delivery_time || null,
    status || 'pending',
    notes || null,
    receiptPath
  ], (err, result) => {
    if (err) {
      console.error('Error creating delivery guide:', err);
      return res.status(500).json({ error: 'Error al crear la guía de entrega', details: err.message });
    }
    res.status(201).json({
      id: result.insertId,
      message: 'Guía de entrega creada exitosamente',
      receiptPath
    });
  });
});

// Update delivery guide
app.put('/api/delivery-guides/:id', (req, res) => {
  const {
    order_id,
    customer_name,
    customer_email,
    customer_phone,
    address,
    city,
    postal_code,
    delivery_date,
    delivery_time,
    status,
    notes
  } = req.body;

  // Parse delivery_date to YYYY-MM-DD format if provided
  let formattedDate = null;
  if (delivery_date) {
    try {
      const date = new Date(delivery_date);
      formattedDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    } catch (error) {
      console.error('Error parsing delivery_date:', error);
    }
  }

  const query = `UPDATE delivery_guides SET
    order_id = ?, customer_name = ?, customer_email = ?, customer_phone = ?,
    address = ?, city = ?, postal_code = ?, delivery_date = ?, delivery_time = ?,
    status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`;

  db.query(query, [
    order_id || null,
    customer_name,
    customer_email || null,
    customer_phone || null,
    address,
    city || null,
    postal_code || null,
    formattedDate,
    delivery_time || null,
    status || 'pending',
    notes || null,
    req.params.id
  ], (err, result) => {
    if (err) {
      console.error('Error updating delivery guide:', err);
      return res.status(500).json({ error: 'Error al actualizar la guía de entrega', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Guía de entrega no encontrada' });
    }
    res.json({ message: 'Guía de entrega actualizada exitosamente' });
  });
});

// Delete delivery guide
app.delete('/api/delivery-guides/:id', (req, res) => {
  const query = 'DELETE FROM delivery_guides WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Delivery guide not found' });
    res.json({ message: 'Delivery guide deleted successfully' });
  });
});

// Upload receipt for delivery guide
app.post('/api/delivery-guides/:id/upload', upload.single('receipt'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const receiptPath = req.file.filename;
  const query = 'UPDATE delivery_guides SET receipt_path = ? WHERE id = ?';
  db.query(query, [receiptPath, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Delivery guide not found' });
    res.json({ message: 'Receipt uploaded successfully', receiptPath });
  });
});

// Get orders (for reference)
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
