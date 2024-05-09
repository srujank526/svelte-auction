import { createServer } from "http";
import { Server } from "socket.io";
import {getSet,getPlayer} from './common/players.js'

const httpServer = createServer();
const io = new Server(httpServer, {
  cors :{
    origin:'http://localhost:5173',
    credentials:true,
  }
});
let clients = []
let set = -1, playerId = -1;
io.on("connection", (socket) => {
  console.log(socket.id)
  socket.on('join-room',({roomId,name})=>{
    socket.join(roomId)
    clients.push({socket:socket.id,roomId,name})
    socket.emit('roomInfo', clients);
    io.to(roomId).emit('roomInfo', Array.from(clients));
  })

  socket.on('reqSet',(room)=>{
    console.log('data...' + room)
    set+=1
    io.emit('resSet',getSet(set))
    playerId = -1
  })
  socket.on('reqPlayer',(room)=>{
    playerId+=1
    let player = getPlayer(set,playerId)
    if(player){
      io.emit('resPlayer',player)
      io.emit('currentBid',{user:null,bidAmount:player.basePrice})
    }
  })
  socket.on('bidPlaced',({socketId,amount})=>{
    let data = {socketId,amount}
    io.emit('bid-is-with',data)
  })
  socket.on('playerSoldTo',data=>{
    io.emit('playerSoldTo',data)
  })
});
// io.emit('welcome',{data:'welcome to auction'})
httpServer.listen(8000);