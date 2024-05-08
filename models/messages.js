const mongoose = require('mongoose')
const shema = mongoose.Schema

const messageSchema = new shema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

module.exports = new mongoose.model('messages',messageSchema)