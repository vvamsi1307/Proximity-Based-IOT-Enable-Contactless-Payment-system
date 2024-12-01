const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./iot-payments.db');

// Create table for transactions (if not exists)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER,
      status TEXT,
      timestamp TEXT
    )
  `);
});

// Endpoint to log a transaction
app.post('/process-payment', (req, res) => {
  const { isInRange, amount } = req.body;

  if (isInRange) {
    const timestamp = new Date().toISOString();
    const status = 'success';

    // Insert transaction into the database
    db.run(
      `INSERT INTO transactions (amount, status, timestamp) VALUES (?, ?, ?)`,
      [amount, status, timestamp],
      function (err) {
        if (err) {
          return res.status(500).send({ status: 'failed', message: 'Transaction failed' });
        }
        res.status(200).send({
          status: 'success',
          message: `Payment of $${amount} successful!`,
        });
      }
    );
  } else {
    res.status(400).send({ status: 'failed', message: 'Payment failed: Out of range' });
  }
});

// Endpoint to get all transactions
app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to fetch transactions' });
    }
    res.status(200).send(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
