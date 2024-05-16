const eventModel = require('../models/events')
const bookingModel = require('../models/booking')

exports.postAddEvents = async (req, res) => {
    try {

        //Function to pass error
        const errFunction = (statusCode, msg) => {
            return res.status(statusCode).json({ msg })
        }

        if (!req.file) errFunction(404, 'Please provide a event picture')
        const imagePath = 'images/events/' + req.file.filename

        const {
            venueName,
            category,
            price,
            advanceAmount,
            country,
            state,
            district,
            city,
            capacity,
            startTime,
            endTime,
            selectedDates,
            discription,
        } = req.body

        const dateArray = selectedDates ? selectedDates.split(',') : []

        if (venueName.trim() === "")
            return errFunction(422, "Please enter venue name.");
        else if (price.trim() === "")
            return errFunction(422, "Please enter the price.");
        else if (advanceAmount.trim() === "")
            return errFunction(422, "Please enter the advance amount.");
        else if (district.trim() === "")
            return errFunction(422, "Please enter the district.");
        else if (city.trim() === "")
            return errFunction(422, "Please enter the city.");
        else if (capacity.trim() === "")
            return errFunction(422, "Please provide the capacity.");
        else if (!startTime)
            return errFunction(422, "Please provide the start time.");
        else if (!endTime)
            return errFunction(422, "Please provide the end time.");
        else if (discription.trim() === "")
            return errFunction(422, "Please provide discription.");
        else if (!category)
            return errFunction(422, "Please select the category.");
        else if (!country)
            return errFunction(422, "Please select a country.");
        else if (!state) return errFunction(422, "Please select a state.");
        else if (dateArray.length === 0)
            return errFunction(422, "Please provide available dates.");
        else {

            req.body.availableDates = dateArray
            req.body.eventImage = imagePath
            req.body.agentId = req.agentId
            await eventModel.create(req.body)
            res.status(200).json({ msg: 'Event added success' })
        }

    } catch (error) {
        console.log('Error in post add events', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getEditEvents = async (req, res) => {
    try {

        const { id } = req.query
        const event = await eventModel.findById(id)
        if (!event) return res.status(404).json({ msg: 'Event not found with id', event })
        res.status(200).json({ msg: 'Event has been sended to the frontent', event })

    } catch (error) {
        console.log('Error in post add events', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postEditEvents = async (req, res) => {
    try {

        //Function to pass error
        const errFunction = (statusCode, msg) => {
            return res.status(statusCode).json({ msg })
        }

        const { id } = req.query
        const findEvent = await eventModel.findById(id)
        let imagePath;

        if (!req.file) imagePath = findEvent.eventImage
        else imagePath = 'images/events/' + req.file.filename

        const {
            venueName,
            category,
            price,
            advanceAmount,
            country,
            state,
            district,
            city,
            capacity,
            startTime,
            endTime,
            selectedDates,
            discription,
        } = req.body

        const dateArray = selectedDates ? selectedDates.split(',') : []

        if (venueName.trim() === "")
            return errFunction(422, "Please enter venue name.");
        else if (price.trim() === "")
            return errFunction(422, "Please enter the price.");
        else if (advanceAmount.trim() === "")
            return errFunction(422, "Please enter the advance amount.");
        else if (district.trim() === "")
            return errFunction(422, "Please enter the district.");
        else if (city.trim() === "")
            return errFunction(422, "Please enter the city.");
        else if (capacity.trim() === "")
            return errFunction(422, "Please provide the capacity.");
        else if (!startTime)
            return errFunction(422, "Please provide the start time.");
        else if (!endTime)
            return errFunction(422, "Please provide the end time.");
        else if (discription.trim() === "")
            return errFunction(422, "Please provide discription.");
        else if (!category)
            return errFunction(422, "Please select the category.");
        else if (!country)
            return errFunction(422, "Please select a country.");
        else if (!state) return errFunction(422, "Please select a state.");
        else if (findEvent.availableDates.length === 0 && dateArray.length === 0)
            return errFunction(422, "Please provide available dates.");
        else {


            req.body.availableDates = dateArray
            req.body.eventImage = imagePath
            req.body.agentId = req.agentId
            await eventModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
            res.status(200).json({ msg: 'Event edit success' })
        }

    } catch (error) {
        console.log('Error in post add events', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.deleteRemoveAvailableDate = async (req, res) => {
    try {

        const { id, index } = req.query
        const parsedIndex = parseInt(index);

        let arrayIndex = `availableDates.${parsedIndex}`

        await eventModel.updateOne({ _id: id }, { $unset: { [arrayIndex]: 1 } })
        await eventModel.updateOne({ _id: id }, { $pull: { availableDates: null } })

        res.status(200).json({ msg: 'Available dates has been removed' })

    } catch (error) {
        console.log('Error in post add events', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getMyEvents = async (req, res) => {
    try {

        const agentId = req.agentId
        const myEvents = await eventModel.find({ agentId })

        res.status(200).json({ msg: 'Agents events has been send to the frontent', myEvents })

    } catch (error) {
        console.log('Error in agent get my signup', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.putBlockCategory = async (req, res) => {
    try {

        const { id } = req.query

        //Checking whether category exist if not exist returning 404
        const findEvent = await eventModel.findById(id)

        if (!findEvent) return res.status(404).json({ msg: 'Event not found' })

        await eventModel.updateOne({ _id: id }, { $set: { isBlocked: findEvent.isBlocked ? false : true } })

        res.status(200).json({ msg: 'Event has been blocked or unblocked' })


    } catch (error) {
        console.log('Error in put block Event', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getMyBookings = async (req, res) => {
    try {

        const agentId = req.agentId

        const bookings = await bookingModel.aggregate([
            {
                $match: { agent: agentId }
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "agent",
                    foreignField: "memberId",
                    as: 'userProfile'
                }
            }
        ]);

        res.status(200).json({ msg: 'Bookings list has been sended to the frontent', bookings })

    } catch (error) {
        console.log('Error in get my booking', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}
 