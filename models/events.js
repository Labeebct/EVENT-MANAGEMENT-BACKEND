const mongoose = require('mongoose')

const schema = mongoose.Schema

const eventSchema = new schema({
    agentId:{
        type:mongoose.Types.ObjectId,
        requred:true
    },
    venueName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    eventImage: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    advanceAmount: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    availableDates: {
        type: Array,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    isBlocked:{     
        type:Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model('eventSchema', eventSchema)