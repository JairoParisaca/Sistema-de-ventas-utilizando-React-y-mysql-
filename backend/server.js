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
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'delivery_system'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
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
app.post('/api/delivery-guides', (req, res) => {
  const { order_id, customer_name, address, status } = req.body;
  const query = 'INSERT INTO delivery_guides (order_id, customer_name, address, status) VALUES (?, ?, ?, ?)';
  db.query(query, [order_id, customer_name, address, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: 'Delivery guide created successfully' });
  });
});

// Update delivery guide
app.put('/api/delivery-guides/:id', (req, res) => {
  const { order_id, customer_name, address, status } = req.body;
  const query = 'UPDATE delivery_guides SET order_id = ?, customer_name = ?, address = ?, status = ? WHERE id = ?';
  db.query(query, [order_id, customer_name, address, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Delivery guide not found' });
    res.json({ message: 'Delivery guide updated successfully' });
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
