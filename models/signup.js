const mongoose = require('mongoose')

const addressObj = {
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobilenum:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    houseno:{
        type:Number,
        required:true
    }
}

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
    address:[addressObj],
    regDate:{
        type:Date,
        default:Date.now()
    }
})


module.exports = new mongoose.model('signup',signupSchema)
