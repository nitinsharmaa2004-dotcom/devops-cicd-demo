require('dotenv').config({ quiet: true });

const os = require('os');
const path = require('path');
const express = require('express');
const pkg = require('./package.json');

const APP_NAME = 'DevOps CI/CD Demo Application';
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Application is running successfully',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/info', (req, res) => {
  res.status(200).json({
    appName: APP_NAME,
    version: pkg.version,
    nodeVersion: process.version,
    environment: NODE_ENV,
    hostname: os.hostname(),
    platform: `${os.type()} ${os.release()} (${os.arch()})`,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    message: NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

function startServer(port = PORT) {
  const server = app.listen(port, () => {
    console.log(`${APP_NAME} running on http://localhost:${port} (env: ${NODE_ENV})`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Set a different PORT in .env`);
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
