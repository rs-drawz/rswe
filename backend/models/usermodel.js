const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter name']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password:
    {
        type: String,
        required: [true, 'please enter valid password'],
        maxLength: [10, 'password exceed about 8 characters'],
        select: false
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    size: {
        type: String
    },
    resetPasswordtoken: {
        type: String
    },
    resetPasswordtokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

userSchema.pre('save', async function (next) {      //pre-middleware function
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);         //bcrypt.js
})

userSchema.methods.getJwtToken = function () {                //jswonwebtoken
    return JWT.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

userSchema.methods.getresettokenpass = function () {
    const token = crypto.randomBytes(20).toString('hex');
    //generate hash and set reset pass token
    this.resetPasswordtoken = crypto.createHash('sha256').update(token).digest('hex');   //sha256-algorithm for security

    //setting expire for above token
    this.resetPasswordtokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}

let model = mongoose.model('User', userSchema);
module.exports = model;