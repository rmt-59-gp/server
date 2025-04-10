

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

        if (!user) {
          return socket.emit('error', { message: 'User not found' });
        }
        question = await generateQuestion(topic)
        

        // Create the room
        const room = await Room.create({
          name,
          topic,
          members: [username],
          host: username,
        });

        // Associate the user with the room
        const userRoom = await UserRoom.create({
          UserId: user.id,
          RoomId: room.id,
        });

        console.log(userRoom, 'userRoom <=====');

        const roomAll = await Room.findAll();
        await Room.update({ questions: question }, {
          where: { id: room.id }
        });


        // Join the room and send room data to the client
        socket.join(room.code);
        socket.emit('room:new', room);
        socket.broadcast.emit('room:get', roomAll);
        await Room.update({
          questions: question
        }, {
          where: {
            id: room.id
          }
        })
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

        // Emit updated room data to all clients in the room
        const updatedRoom = await Room.findOne({ where: { code } });
        io.to(code).emit('room:updated', updatedRoom);

        const roomAll = await Room.findAll();
        socket.broadcast.emit('room:get', roomAll);
        // io.to(code).emit('room:joined', { members });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('room:leave', async ({ code, username }) => {
      try {
        // Find the room
        const room = await Room.findOne({
          where: { code },
        });
    
        if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }
    
        // Remove the user from the room members
        const updatedMembers = room.members.filter((member) => member !== username);
        await room.update({ members: updatedMembers });
    
        console.log(`User ${username} left room ${code}`);
    
        // Leave the room
        socket.leave(code);
    
        // Emit updated room data to all clients in the room
        const updatedRoom = await Room.findOne({ where: { code } });
        io.to(code).emit('room:updated', updatedRoom);
      } catch (error) {
        console.error('Error leaving room:', error);
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    
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

    const room = await Room.findOne({
      where: {
        code: arg.roomId
      }
    })
    
    const userRoomData = await UserRoom.findOne({
      where: {
        UserId: userData.id,
        RoomId: room.id
      }
    })
    
    // console.log(userRoomData, '<=====');
    // socket.emit('user:score', {score: userRoomData.score})
    
  })
  
  
  socket.on('endGame', async ({ code }) => {
    try {
      const room = await Room.findOne({
        where: { code },
      });
  
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }
  
      const leaderboard = await UserRoom.findAll({
        where: { RoomId: room.id },
        include: [{ model: User, attributes: ['name'] }],
        attributes: ['UserId', 'score'],
        order: [['score', 'DESC']],
      });
  
      const leaderboardData = leaderboard.map((entry, index) => ({
        rank: index + 1,
        username: entry.User.name,
        score: entry.score,
      }));
  
      // Emit leaderboard to all clients in the room
      io.to(code).emit('gameEnded', { leaderboard: leaderboardData });
    } catch (error) {
      console.error('Error ending game:', error);
      socket.emit('error', { message: 'Failed to end game' });
    }
  });
  
  socket.on('leaderboard:fetch', async ({ roomId }) => {
    try {
      const room = await Room.findOne({
        where: { id: roomId },
      });
      
      if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }
        
        const leaderboard = await UserRoom.findAll({
          where: { RoomId: roomId },
          include: [
            {
              model: User,
              attributes: ['name', 'score'],
            },
          ],
          order: [[{ model: User }, 'score', 'DESC']],
        });

        const leaderboardData = leaderboard.map((entry, index) => ({
          rank: index + 1,
          username: entry.User.name,
          score: entry.User.score,
        }));
        
        socket.emit('leaderboard:get', leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        socket.emit('error', { message: 'Failed to fetch leaderboard' });
      }
    });

  socket.on('startQuiz', async (code)=> {
    try {
      console.log(code, '<==== RoomCode');

      io.to(code).emit('quiz:start', {roomCode:code})
    } catch (error) {
      console.error('Error starting quiz:', error);
      socket.emit('error', { message: 'Failed to start quiz' });
    }
  })
    
  } catch (error) {
    console.error('Socket error:', error);
  }
    
    
  }
  
  
  
  module.exports = roomHandler;