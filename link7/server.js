const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static('public'));

// In-memory room store: { content: string, members: number, updatedAt: number }
const rooms = new Map();

// Generate human-friendly 6-char room codes
function generateCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/1/O/0
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

io.on('connection', (socket) => {
  // Create a new room
  socket.on('room:create', (cb) => {
    let code;
    do { code = generateCode(); } while (rooms.has(code));

    rooms.set(code, { content: '', members: 0, updatedAt: Date.now() });
    socket.join(code);
    rooms.get(code).members++;

    cb && cb({ ok: true, code, content: '' });
  });

  // Join existing room
  socket.on('room:join', (code, cb) => {
    code = String(code || '').toUpperCase().trim();
    const room = rooms.get(code);
    if (!room) {
      cb && cb({ ok: false, error: 'ROOM_NOT_FOUND' });
      return;
    }
    socket.join(code);
    room.members++;
    cb && cb({ ok: true, code, content: room.content });
    socket.to(code).emit('presence:join');
  });

  // Note content update from a client
  socket.on('note:update', ({ code, content }) => {
    const room = rooms.get(code);
    if (!room) return;
    room.content = content;
    room.updatedAt = Date.now();
    // Send to everyone else in the room (not the sender)
    socket.to(code).emit('note:remote', content);
  });

  // Clean up on disconnect
  socket.on('disconnecting', () => {
    for (const code of socket.rooms) {
      if (code === socket.id) continue;
      const room = rooms.get(code);
      if (!room) continue;

      room.members = Math.max(0, (room.members || 1) - 1);
      if (room.members === 0) {
        rooms.delete(code);
      } else {
        socket.to(code).emit('presence:leave');
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Realtime Notes running on http://localhost:${PORT}`);
});
