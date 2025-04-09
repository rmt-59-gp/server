const generateQuestion = require('../helpers/generateQuestion');
const generateCode = require('../helpers/generateRoomCode');
const { generateToken } = require('../helpers/jwt');
const {User, Room, UserRoom} = require('../models');
class Controller {
    static async createUser(req, res, next) {
        try {
            const {name} = req.body
            if(!name) throw {name: 'BadRequest', message: 'Name is required'}

            const user = await User.create(req.body);

            // req.user = {
            //     id: user.id,
            //     name: user.name
            // }

            const access_token = generateToken({
                id: user.id,
                name: user.name
            })

            res.status(201).json({access_token})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async createRoom(req, res, next){
        try {
            const {topic} = req.body
            const roomCode = generateCode(6)
            const question = await generateQuestion(topic)
            const host = req.user.id

            const room = await Room.create({
                CodeRoom: roomCode,
                question,
                host
            }, {
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt']
                }
            })

            await UserRoom.create({
                UserId: host,
                RoomId: room.id
            })

            console.log(JSON.parse(room.question));

            res.status(201).json(room)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async joinRoomFromParam(req, res, next){
        try {
            const {CodeRoom} = req.params || req.body
            const userId = req.user.id

            const room = await Room.findOne({
                where: {
                    CodeRoom
                }
            })
            if(!room) throw {name: 'NotFound', message: 'Room not found'}

            const userRoom = await UserRoom.create({
                UserId: userId,
                RoomId: room.id
            }, {
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt']
                }
            })
            
            res.status(200).json(userRoom)
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async joinRoomFromCode(req, res, next){
        try {
            const {CodeRoom} = req.body
            const userId = req.user.id
            if(!CodeRoom) throw {name: 'BadRequest', message: 'CodeRoom is required'}

            const room = await Room.findOne({
                where: {
                    CodeRoom
                }
            })

            if(!room) throw {name: 'NotFound', message: 'Room not found'}

            const userRoom = await UserRoom.create({
                UserId: userId,
                RoomId: room.id
            }, {
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt']
                }
            })
            
            res.status(200).json(userRoom)

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getQuestion(req, res, next){
        try {
            const question = await Room.findByPk(+req.params.roomId)
            res.status(200).json({
                data: question.question
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async submitAnswers(req, res, next) {
        try {
            const { roomId } = req.params;
            const { answers } = req.body;
            const userId = req.user.id;
    
            if (!answers || !Array.isArray(answers)) {
                throw { name: 'BadRequest', message: 'Answers are required and must be an array' };
            }
    
            const room = await Room.findByPk(roomId);
            if (!room) throw { name: 'NotFound', message: 'Room not found' };
    
            const questions = JSON.parse(room.question);
    
            let score = 0;
            answers.forEach((answer) => {
                const question = questions.find((q) => q.id === answer.questionId);
                if (question && question.answer === answer.answer) {
                    score += 10;
                }
            });
    
            const userRoom = await UserRoom.findOne({
                where: { UserId: userId, RoomId: roomId },
            });
            if (userRoom) {
                userRoom.score = (userRoom.score || 0) + score;
                await userRoom.save();
            }
    
            res.status(200).json({ message: 'Answers submitted successfully', score });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async startGame(req, res, next) {
        try {
            const { roomId } = req.params;
    
            const room = await Room.findByPk(roomId);
            if (!room) throw { name: 'NotFound', message: 'Room not found' };
    
            req.io.to(room.CodeRoom).emit('gameStarted', { message: 'Game has started!' });
    
            res.status(200).json({ message: 'Game started successfully' });
        } catch (error) {
            console.log(error,'<--- ini errornya');
            next(error);
        }
    }
    static async endGame(req, res, next) {
        try {
            const { roomId } = req.params;
    
            const room = await Room.findByPk(roomId);
            if (!room) throw { name: 'NotFound', message: 'Room not found' };
    
            const leaderboard = await UserRoom.findAll({
                where: { RoomId: roomId },
                include: [{ model: User, attributes: ['name'] }],
                attributes: ['UserId', 'score'],
                order: [['score', 'DESC']],
            });
    
            req.io.to(room.CodeRoom).emit('gameEnded', { leaderboard });
    
            res.status(200).json({ message: 'Game ended successfully', leaderboard });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async getLeaderboard(req, res, next) {
        try {
            const { roomId } = req.params;
    
            const room = await Room.findByPk(roomId);
            if (!room) throw { name: 'NotFound', message: 'Room not found' };
    
            const leaderboard = await UserRoom.findAll({
                where: { RoomId: roomId },
                include: [{ model: User, attributes: ['name'] }],
                attributes: ['UserId', 'score'],
                order: [['score', 'DESC']],
            });
    
            res.status(200).json({ leaderboard });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = Controller;