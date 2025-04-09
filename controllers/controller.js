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
}

module.exports = Controller;