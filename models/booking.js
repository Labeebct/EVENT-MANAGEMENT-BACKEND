const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookingSchema = new schema({
    orderId: {
        type: String,
        default: null
    },
    currency: {
        type: String,
        default: 'INR'
    },
    amount: {
        type: Number,
        required: true
    },
    event: {
        type: Object,
        required: true
    },
    selectedDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    agent: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isPaymentDone: {
        type: Boolean,
        default: false
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    bookedDate: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })

module.exports = mongoose.model('booking', bookingSchema)