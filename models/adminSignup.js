const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    regDate:{
        type:Date,
        default:Date.now()
    }
})


module.exports = new mongoose.model('adminSignup',signupSchema)
