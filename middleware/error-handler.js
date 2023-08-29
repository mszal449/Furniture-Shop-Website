// Own error handler is used for educational purposes
// There are packages that provide this functionality for us,
// however this solution allows to deeply understand the problem

const {CustomAPIError} = require('../errors/custom-error')

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err)
    return res.status(500).json({ msg : 'Something went wrong, please try again' })

}

module.exports = errorHandlerMiddleware 

