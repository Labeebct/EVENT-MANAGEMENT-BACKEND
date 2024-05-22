const categoryModel = require('../models/category')
const eventsModel = require('../models/events')
const bookingModel = require('../models/booking')

exports.getCategory = async (req, res) => {
    try {

        const categories = await categoryModel.find({ isBlocked: false })
        res.status(200).json({ msg: 'Category list has been sended to the frontent', categories })

    } catch (error) {
        console.log('Error in get catgory');
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getEventsList = async (req, res) => {
    try {

        const { category } = req.query

        const events = category ? await eventsModel.find({ category, isBlocked: false }) : await eventsModel.find({ isBlocked: false })

        res.status(200).json({ msg: 'Events list has been sended to frontent', events })
    } catch (error) {
        console.log('Error in get events list', error);
        res.status(500).json({ msg: 'Internal server error' })
    }
}

exports.getViewEvent = async (req, res) => {
    try {

        const { id, userId } = req.query

        const event = await eventsModel.findById(id)
        const findEventBooked = await bookingModel.findOne({ user: userId, 'event._id': id })

        if (!event) return res.status(404).jsn({ msg: 'Event not found', event })
        res.status(200).json({ msg: 'Event has been send to the frontent', event, findEventBooked })

    } catch (error) {
        console.log('Error in get view event', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}