const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Routes (for Docker/K8s healthchecks)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Health Check Route for API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Devops Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Devops Backend Service');
});

module.exports = app;
