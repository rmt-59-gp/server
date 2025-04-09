if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const { createServer } = require("http");
const handlers = require('./handlers');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: "*"
});

handlers(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use(require('./routes/index'));

module.exports = httpServer;
