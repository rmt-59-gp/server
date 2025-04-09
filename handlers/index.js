const connectionHandler = require("./connection");
const roomHandler = require("./room");

function handlers(io) {
  function onConnection(socket) {
    connectionHandler({ io, socket });
    roomHandler({ io, socket });
  }

  io.on('connection', onConnection);
}

module.exports = handlers;