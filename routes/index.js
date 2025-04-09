const express = require('express');
const RoomController = require('../controllers/room.controller');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});


router.get('/rooms', RoomController.getAllRooms);

router.post('/rooms', Controller.createRoom)
router.post('/rooms/join', Controller.joinRoomFromCode)
router.post('/rooms/:CodeRoom/join', Controller.joinRoomFromParam)
router.get('/rooms/:roomId/questions', Controller.getQuestion)
router.post('/rooms/:roomId/answers', Controller.submitAnswers)
router.post('/rooms/:roomId/start', Controller.startGame)
router.post('/rooms/:roomId/end', Controller.endGame)
router.get('/rooms/:roomId/leaderboard', Controller.getLeaderboard)


module.exports = router;