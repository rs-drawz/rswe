const { send } = require("express/lib/response");

const sendToken = (user, statusCode, res) => {
    //create JWT  token
    const token = user.getJwtToken();

    //setting cokkies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            sucess: true,
            token,
            user
        })
}

module.exports = sendToken 