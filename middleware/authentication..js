const { verifyToken } = require("../helpers/jwt");
const {User} = require("../models");

async function authentication(req, res, next){
    try {
        const {authorization} = req.headers;
    
        if(!authorization) throw {name: 'Unauthorized', message: 'Invalid token'}
    
        const token = authorization.split(' ')
        if(token[0] !== 'Bearer' || !token[1]) throw {name: 'Unauthorized', message: 'Invalid token'}
    
        const isValidToken = verifyToken(token[1])
    
        if(!isValidToken) throw {name: 'Unauthorized', message: 'Invalid token'}

        const isValidUser = await User.findByPk(+isValidToken.id)

        if(!isValidUser) throw {name: 'Unauthorized', message: 'Invalid token'}

        req.user = {
            id: isValidUser.id,
            name: isValidUser.name
        }

        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
    
}

module.exports = authentication