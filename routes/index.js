const Controller = require('../controllers/controller');
const authentication = require('../middleware/authentication.');
const errorHandler = require('../middleware/errorHandling');
const router = require('express').Router();


router.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
router.post('/users', Controller.createUser);
router.use(authentication)

router.post('/rooms', Controller.createRoom)
router.post('/rooms/join', Controller.joinRoomFromCode)
router.post('/rooms/:CodeRoom/join', Controller.joinRoomFromParam)
router.get('/rooms/:roomId/questions', Controller.getQuestion)
// router.post('/rooms/:roomId/answers')
// router.post('/rooms/:roomId/start')
// router.post('/rooms/:roomId/end')
// router.get('/rooms/:roomId/leaderboard')

module.exports = router;