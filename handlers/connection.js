const { User } = require('../models');

async function connectionHandler({ io, socket }) {
  try {
    console.log('New client connected:', socket.handshake.auth);

    // Check if the username is provided
    if (!socket.handshake.auth.username) {
      socket.disconnect();
      return;
    }

    // Check if the username is already in use
    await User.findOrCreate({
      where: { name: socket.handshake.auth.username },
    });

    socket.emit('message', `Welcome to the server ${socket.handshake.auth.username}! Your ID is ${socket.id}`);

    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);

      await User.destroy({
        where: {
          name: socket.handshake.auth.username,
        },
      });
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = connectionHandler;