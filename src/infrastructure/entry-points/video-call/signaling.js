const { Server } = require('socket.io');

function createSignaling(httpServer) {
  const io = new Server(httpServer, {
    cors: {
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
          // allow by default to avoid blocking in varied dev setups
          callback(null, true);
        }
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store connected users per room
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = new Set();
      rooms[roomId].add(socket.id);

      console.log(`User ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit('user-joined', { userId: socket.id, roomId });

      const existingUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
      if (existingUsers.length > 0) {
        socket.emit('existing-users', existingUsers);
      }
    });

    socket.on('offer', (data) => {
      socket.to(data.target).emit('offer', { offer: data.offer, from: socket.id });
    });

    socket.on('answer', (data) => {
      socket.to(data.target).emit('answer', { answer: data.answer, from: socket.id });
    });

    socket.on('ice-candidate', (data) => {
      socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      if (rooms[roomId]) {
        rooms[roomId].delete(socket.id);
        if (rooms[roomId].size === 0) delete rooms[roomId];
        else socket.to(roomId).emit('user-left', { userId: socket.id, roomId });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const [roomId, users] of Object.entries(rooms)) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          socket.to(roomId).emit('user-left', { userId: socket.id, roomId });
          if (users.size === 0) delete rooms[roomId];
        }
      }
    });
  });

  return io;
}

module.exports = { createSignaling };
