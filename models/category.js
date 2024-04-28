const mongoose = require('mongoose')
const shema = mongoose.Schema

const categorySchema = new shema({
    categoryImage: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    categoryDiscription: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = new mongoose.model('category', categorySchema)