if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandling')

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: "*" // dibatasin yg bisa akses socket, ganti aja jd "http://localhost:5173"
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('sendScore', (data) => {
//       io.emit('updateScore', data);
//   });

//   socket.on('disconnect', () => {
//       console.log('User  disconnected');
//   });
// });
const db = {
  count: 0,
  messages: [],
  scores: {}
};
async function broadcastOnlineUsers(io, socket) {
  const sockets = await io.fetchSockets();

  const onlineUsers = []
  for (const socket of sockets) {
    console.log(socket.id);
    console.log(socket.handshake.auth);
    onlineUsers.push({ socketId: socket.id, username: socket.handshake.auth.username })
  }

  io.emit("online:users", onlineUsers)
}
io.on("connection", (socket) => {
  console.log(socket.id, "<<< socket.id connected");
  console.log(socket.handshake.auth, "<<< socket.handshake.auth");

  socket.emit("score:info", db.scores);

  socket.on("score:update", ({ username, score }) => {
  
    db.scores[username] = (db.scores[username] || 0) + score;

    console.log(db.scores, "<<< updated scores");

    io.emit("score:info", db.scores);
  });

  socket.on("disconnect", () => {
    broadcastOnlineUsers(io);
  });
});

app.use(errorHandler)
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
httpServer.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`)
})