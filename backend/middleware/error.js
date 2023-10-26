// const { stack } = require("../app");

const ErrorHandler = require("../seeder/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV == 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        })
    }
    if (process.env.NODE_ENV == 'production') {
        let message = err.message;
        let error = new Error(message);
        //validation error
        if (err.name == "ValidationError") {
            message = Object.values(err.errors).map(value => value.message);
            error = new Error(message),
            error.statusCode=400
        }

        if (err.name == "CastError") {
            message = `Error not found:${err.path}`;
            error = new Error(message);
            error.statusCode=400
        }

        if(err.code == 11000){
            let message=`duplicate ${object.keys(err.keyValue)} error`;
            error = new Error(message)
            error.statusCode=400

        }
        if(err.name=='JSONWebTokenError'){
            let message = 'JSON web token is invallid,try again';
            error= new Error(message)
            error.statusCode=400

        }
        if(err.name=='TokenExpiredError'){
            let message = 'JSON web token is expiredor invalid,try again';
            error= new Error(message)
            error.statusCode=400

        }
        res.status(err.statusCode).json({
            success: false,
            message: error.message || "Internel server error"
        })
    }
}