const ErrorHandler = require("../seeder/errorHandler");
const catchasyncError = require("./catchasyncError");
const jwt=require('jsonwebtoken');
const user=require('../models/usermodel')

exports.isAuthenticateUser = catchasyncError(async (req,res,next)=>{
  const {token}=req.cookies;

  if(!token){
    return next(new ErrorHandler('login first to work with this resource',401));
  }

  const decode=jwt.verify(token,process.env.JWT_SECRET)
  req.user=await user.findById(decode.id)
  next();
})

exports.authorzerole=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not alllowed`,401))
        }
         next();
    }
}

