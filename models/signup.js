const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username:{
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
    verified:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'active'
    },
    regDate:{
        type:Date,
        default:Date.now()
    }
})


module.exports = new mongoose.model('signup',signupSchema)
