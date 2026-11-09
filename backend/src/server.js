require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Task Manager API is healthy' });
});

app.listen(port, () => {
  console.log(`Task Manager API listening on http://localhost:${port}`);
});

// Initialize the PostgreSQL connection pool after dotenv has loaded.
require('./db/database');
