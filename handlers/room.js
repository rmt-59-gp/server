
const generateQuestion = require('../helpers/generateQuestion');
const { Room, UserRoom, User } = require('../models');

async function roomHandler({ io, socket }) {

  let question
  try {
    socket.on('room:create', async ({ name, topic }) => {
      try {
        const username = socket.handshake.auth.username;

        // Find the user
        const user = await User.findOne({
          where: { name: username },
        });

        console.log(1, '=======');
        if (!user) {
          return socket.emit('error', { message: 'User not found' });
        }

        question = await generateQuestion(topic)
        
        console.log(1, '=======');
        // console.log(1);
        
        // Create the room
        const room = await Room.create({
          name,
          topic,
          members: [username],
          host: username,
        });
        
        console.log(1, '=======');
        // console.log(1);
        // Associate the user with the room
        await UserRoom.create({
          UserId: user.id,
          RoomId: room.id,
        });
        
        console.log(1);
        const roomAll = await Room.findAll();
        await Room.update({ questions: question }, {
          where: { id: room.id }
        });

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

  let roomCode
  
  socket.on('question:getRoomCode', async (arg)=> {
    question = await Room.findOne({
      where: {
        code: arg.id
      }
    })
    console.log(question.questions, '<=====');
    
    socket.emit('question:get', {question: question.questions})
  })

  socket.on('username:send', async (arg)=> {
    const userData = await User.findOne({
      where: {
        name: arg.name
      }
    })

    const userRoomData = await UserRoom.findOne({
      where: {
        UserId: userData.id
      }
    })

    console.log(userRoomData, '<=====');
    socket.emit('user:score', {score: userRoomData.score})
    
  })
  // question = await Room.findOne({
  //   where: {
  //     code: roomCode
  //   }
  // })
  
}


module.exports = roomHandler;