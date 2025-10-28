const express = require('express');
const http = require('http');
const cors = require('cors');
const { createSignaling } = require('./signaling');

const app = express();

// Enable CORS for allowed origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // don't block programmatically; allow other origins by returning true
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'WebRTC Signaling Server is running' });
});

// Use HTTP server (no certificates)
const server = http.createServer(app);

// Attach signaling functionality (Socket.IO)
const io = createSignaling(server);

const PORT = process.env.VIDEO_CALL_PORT || process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = { app, server, io };
