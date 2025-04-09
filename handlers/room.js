const { Room, UserRoom, User } = require('../models');

async function roomHandler({ io, socket }) {
  try {
    socket.on('room:create', async ({ name, topic }) => {
      try {
        const username = socket.handshake.auth.username;

        // Find the user
        const user = await User.findOne({
          where: { name: username },
        });

        if (!user) {
          return socket.emit('error', { message: 'User not found' });
        }

        // Create the room
        const room = await Room.create({
          name,
          topic,
          members: [username],
          host: username,
        });

        // Associate the user with the room
        await UserRoom.create({
          UserId: user.id,
          RoomId: room.id,
        });

        const roomAll = await Room.findAll();

        // Join the room and send room data to the client
        socket.join(room.code);
        socket.emit('room:new', room);
        socket.broadcast.emit('room:get', roomAll);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    socket.on('room:join', async ({ code }) => {
      try {
        const username = socket.handshake.auth.username;

        // Find the room
        const room = await Room.findOne({
          where: { code },
        });

        if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }

        // Update room members
        const updatedMembers = Array.from(new Set([...room.members, username]));
        await room.update({ members: updatedMembers });

        console.log(`User ${username} joined room ${code}`);

        // Join the room
        socket.join(code);

        const roomAll = await Room.findAll();
        socket.broadcast.emit('room:get', roomAll);
        // io.to(code).emit('room:joined', { members });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });
  } catch (error) {
    console.error('Socket error:', error);
  }
}


module.exports = roomHandler;