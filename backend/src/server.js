require('dotenv').config();

const cors = require('cors');
const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Task Manager API is healthy' });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error('Unhandled API error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Task Manager API listening on http://localhost:${port}`);
});

