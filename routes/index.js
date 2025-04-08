const Controller = require('../controllers/controller');
const router = require('express').Router();


router.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
router.post('/users', Controller.createUser);
// router.post('/rooms')
// router.post('/rooms/:roomId/join')
// router.get('/rooms/:roomId/questions')
// router.post('/rooms/:roomId/answers')
// router.post('/rooms/:roomId/start')
// router.post('/rooms/:roomId/end')
// router.get('/rooms/:roomId/leaderboard')

module.exports = router;