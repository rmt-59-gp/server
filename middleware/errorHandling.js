function errorHandler(err, req, res, next) {
    let status = 500;
    let message = 'Internal server error';

    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }

    switch (err.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            status = 400;
            message = err.errors[0].message;
            break;
        case 'BadRequest':
            status = 400;
            message = err.message;
            break;
        case 'JsonWebTokenError':
            status = 401;
            message = "Invalid token";
            break;
        case 'Unauthorized':
            status = 401;
            message = err.message;
            break;
        case 'NotFoundError':
            status = 404;
            message = "Data not found";
            break;
        case 'ForbiddenError':
            status = 403;
            message = "You are not authorized";
            break;
        default:
            break;
    }

    res.status(status).json({ message });
}

module.exports = errorHandler