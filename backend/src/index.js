require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const client = require('prom-client');

// Initialize server
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Setup Prometheus metrics collection
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Custom metrics to track API request duration and count
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10]
});

// Middleware to track request durations
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    
    // Clean route path for labels (prevent high-cardinality with IDs)
    let route = req.baseUrl + req.path;
    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        route = route.replace(req.params[key], `:${key}`);
      });
    }

    httpRequestDurationMicroseconds
      .labels(req.method, route || req.url, res.statusCode)
      .observe(durationInSeconds);
  });
  next();
});

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/weights', require('./routes/weights'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Metrics scrape endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Unhandled Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`FitOps Server is running on port ${PORT}`);
  console.log(`Prometheus metrics accessible at http://localhost:${PORT}/metrics`);
});

module.exports = app; // Export for unit tests
