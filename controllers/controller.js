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
            const roomCode = generateCode(6)
            const question = await generateQuestion("politik")
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
            // console.log(question);
            // console.log(req.user);
            // const {authorization} = req.headers;

            // console.log(authorization);
            console.log(JSON.parse(room.question));

            res.status(201).json(room)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = Controller;