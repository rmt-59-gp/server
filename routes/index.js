const express = require('express');
const RoomController = require('../controllers/room.controller');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});


router.get('/rooms', RoomController.getAllRooms);

module.exports = router;