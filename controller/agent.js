const eventModel = require('../models/events')

//Function to pass error
const errFunction = (statusCode, msg) => {
    return res.status(statusCode).json({ msg })
}

exports.postAddEvents = async (req, res) => {
    try {

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
        
        const dateArray = selectedDates? selectedDates.split(',') : []

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
            res.status(200).json({msg:'Event added success'})
        }

    } catch (error) {
        console.log('Error in post add events', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
} 