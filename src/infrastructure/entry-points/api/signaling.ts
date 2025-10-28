import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

interface RoomData {
  [key: string]: Set<string>;
}

export const createSignaling = (httpServer: Server) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://health-platform-frontend.vercel.app'
        ];

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          // Allow by default for development flexibility
          callback(null, true);
        }
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store connected users per room
  const rooms: RoomData = {};

  io.on('connection', (socket) => {
    console.log(`Video call user connected: ${socket.id}`);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = new Set();
      rooms[roomId].add(socket.id);

      console.log(`User ${socket.id} joined video call room ${roomId}`);

      socket.to(roomId).emit('user-joined', { userId: socket.id, roomId });

      const existingUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
      if (existingUsers.length > 0) {
        socket.emit('existing-users', existingUsers);
      }
    });

    socket.on('offer', (data: { target: string; offer: any }) => {
      socket.to(data.target).emit('offer', { offer: data.offer, from: socket.id });
    });

    socket.on('answer', (data: { target: string; answer: any }) => {
      socket.to(data.target).emit('answer', { answer: data.answer, from: socket.id });
    });

    socket.on('ice-candidate', (data: { target: string; candidate: any }) => {
      socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      if (rooms[roomId]) {
        rooms[roomId].delete(socket.id);
        if (rooms[roomId].size === 0) delete rooms[roomId];
        else socket.to(roomId).emit('user-left', { userId: socket.id, roomId });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Video call user disconnected: ${socket.id}`);
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
};