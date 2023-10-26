const req = require('express/lib/request');
const catchasyncError = require('../middleware/catchasyncError');
const UserModel = require('../models/usermodel');
const sendEmail = require('../seeder/email');
const errorhandler = require('../seeder/errorHandler');
const sendToken = require('../seeder/jwt')
const crypto = require('crypto')

//REGISTERUSER-/api/v1/register
exports.registerUser = catchasyncError(async (req, res, next) => {
    const { name, email, password,role } = req.body;
    let avatar; 
    if(req.file){
        avatar=`${req.protocol}://${req.host}/uploads/users${req.file.originalname}`
    }
    const User = await UserModel.create({
        name,
        email,
        password,
        avatar,
        role
    });

    sendToken(User, 201, res)

})

//LOGINUSER-/api/v1/login
exports.loginuser = catchasyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorhandler('please enter email and password', 400));
    }

    //user data finding in database
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
        return next(new errorhandler('Invalid email or password', 401));
    }

    if (!await user.isValidPassword(password)) {
        return next(new errorhandler('Invalid email or password', 401));
    }

    sendToken(user, 201, res)

})
//LOGOUTUSER-/api/v1/logout
exports.logoutuser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            sucess: true,
            message: "Logout"
        })
}
//FORGOTPASSWORD-/api/v1/password/forgot
exports.forgotpassword = catchasyncError(async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
        return next(new errorhandler('user not found', 404));
    }

    const resettoken = user.getresettokenpass()
    await user.save({ validateBeforeSave: false })

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resettoken}`


    const message = `your password reset URL is as followed\n\n
    ${resetUrl}\n\nIf you are not requested this email,then ignore it`;

    try {

        await sendEmail({
            email: user.email,
            subject: "rsaart password recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordtoken = undefined
        user.resetPasswordtokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new errorhandler(error.message), 500)
    }

})
//RESETPASSWORD-/api/v1/password/reset/:token
exports.resetpassword = catchasyncError(async (req, res, next) => {
    const resetPasswordtoken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await UserModel.findOne({
        resetPasswordtoken,
        resetPasswordtokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new errorhandler('password reset token is expired or invalid', 401))
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new errorhandler('password does not match', 401))
    }

    user.password = req.body.password;
    user.resetPasswordtoken = undefined;
    user.resetPasswordtokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendToken(user, 201, res)

})

//getuserprofile-/api/v1/myprofile

exports.getuserprofile = catchasyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id)
    res.status(200).json({
        sucess: true,
        user
    })
})

//change password
exports.changepassword = catchasyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');

    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new errorhandler('Old password is incorrect', 401))
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        sucess: true
    })
})

//update profile
exports.updateprofile = catchasyncError(async (req, res, next) => {
    const newuserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await UserModel.findByIdAndUpdate(req.user.id, newuserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        sucess: true,
        user
    })

})
//admin-getallusers=/admin/getallusers

exports.getallusers = catchasyncError(async (req, res, next) => {
    const users = await UserModel.find();
    res.status(200).json({
        sucess: true,
        users
    })
})

//admin-getspecificuser=admin/user/64ffaf281f0bb992194592ba

exports.getUser = catchasyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id)
    if (!user) {
        return next(new errorhandler(`User not found with this id ${req.params.id}`))

    }
    res.status(200).json({
        sucess: true,
        user
    })
})

//admin-update user
exports.updateuser = catchasyncError(async (req, res, next) => {
    const newuserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await UserModel.findByIdAndUpdate(req.params.id, newuserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        sucess: true,
        user
    })

})

//admin-deleteuser:
exports.deleteUser = catchasyncError(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id)
    if (!user) {
        return next(new errorhandler(`User not found with this id ${req.params.id}`))

    }
    await UserModel.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true
    })
})


