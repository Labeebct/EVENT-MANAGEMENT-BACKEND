const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const profileSchemaObj = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
    },
    agentId: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId,
    },
    role: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    fullname: {
        required: true,
        type: String
    },
    mobilenum: {
        required: true,
        type: Number
    },
    profile: {
        required: true,
        type: String
    },
    dob: {
        required: true,
        type: String
    },
    gender: {
        required: true,
        type: String
    },
    occupation: {
        required: true,
        type: String
    },
    referalsource: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },
    district: {
        required: true,
        type: String
    },
    pincode: {
        required: true,
        type: Number
    },
    city: {
        required: true,
        type: String
    },
    landmark: {
        required: true,
        type: String
    },
    houseno: {
        required: true,
        type: Number
    }
})

module.exports = new mongoose.model('profile', profileSchemaObj)
