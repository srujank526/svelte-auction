import { createServer } from "http";
import { Server } from "socket.io";
import { getNewPlayerSet, getSet, getPlayer } from './common/players.js';

const PORT = process.env.PORT || 8000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});

let clients = [];
let roomData = {}; // Object to store data for each room

io.on("connection", (socket) => {

  socket.on('join-room', ({ name, roomId }) => {

    socket.join(roomId);
    clients.push({ socket: socket.id, roomId, name });

    // Initialize room data if it doesn't exist
    if (!roomData[roomId]) {
      roomData[roomId] = {
        set: -1,
        playerId: -1,
        players: getNewPlayerSet() // Get a fresh set of player data for the room
      };
    }

    const filteredClients = clients.filter(client => client.roomId === roomId);
    console.log(filteredClients);
    io.to(roomId).emit('roomInfo', filteredClients);

    socket.on('reqSet', () => {
      roomData[roomId].set += 1;
      roomData[roomId].playerId = -1; // Reset player ID when a new set is requested
      io.to(roomId).emit('resSet', getSet(roomData[roomId].set));
    });

    socket.on('reqPlayer', () => {
      roomData[roomId].playerId += 1;
      let player = getPlayer(roomData[roomId].players, roomData[roomId].playerId);
      if (player) {
        io.to(roomId).emit('resPlayer', player);
        io.to(roomId).emit('currentBid', { user: null, bidAmount: player.basePrice });
      }
    });

    socket.on('bidPlaced', ({ socketId, amount }) => {
      let data = { socketId, amount };
      io.to(roomId).emit('bid-is-with', data);
    });

    socket.on('playerSoldTo', data => {
      io.to(roomId).emit('playerSoldTo', data);
    });
  });
});

httpServer.listen(PORT);