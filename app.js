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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const attachSocketIO = (io) => (req, res, next) => {
  req.io = io;
  next();
};
app.use(attachSocketIO(io));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use(require('./routes/index'));
app.use(require('./middleware/errorHandling'))

module.exports = httpServer;

