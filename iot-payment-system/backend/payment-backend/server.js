const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;

let transactionHistory = [];

app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive transaction details
app.post('/transaction', (req, res) => {
  const { amount, status } = req.body;
  const transaction = { amount, status, timestamp: new Date().toISOString() };
  transactionHistory.push(transaction);
  res.status(200).send({ message: 'Transaction recorded successfully' });
});

// Endpoint to get transaction history
app.get('/transactions', (req, res) => {
  res.status(200).json(transactionHistory);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
