const {User} = require('../models');
class Controller {
    static async createUser(req, res, next) {
        try {
            const user = await User.create(req.body);
            res.status(201).json({
                id: user.id,
                name: user.name
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = Controller;