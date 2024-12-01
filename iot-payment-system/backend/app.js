const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./iot-payments.db", (err) => {
  if (err) console.error("Error opening database:", err.message);
  else console.log("Connected to SQLite database.");
});

// Create tables
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY, deviceId TEXT UNIQUE)");
  db.run("CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, deviceId TEXT, amount REAL, transactionId TEXT, status TEXT)");
});

// Register a new device
app.post("/api/register-device", (req, res) => {
  const { deviceId } = req.body;
  const query = "INSERT INTO devices (deviceId) VALUES (?)";

  db.run(query, [deviceId], (err) => {
    if (err) {
      res.status(400).json({ message: "Device already registered." });
    } else {
      res.status(200).json({ message: "Device registered successfully." });
    }
  });
});

// Make a payment
app.post("/api/make-payment", (req, res) => {
  const { deviceId, amount } = req.body;
  const transactionId = `TXN${Date.now()}`;
  const status = "Success";

  const query = "INSERT INTO payments (deviceId, amount, transactionId, status) VALUES (?, ?, ?, ?)";

  db.run(query, [deviceId, amount, transactionId, status], (err) => {
    if (err) {
      res.status(400).json({ message: "Payment failed.", error: err.message });
    } else {
      res.status(200).json({ status, transactionId });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
