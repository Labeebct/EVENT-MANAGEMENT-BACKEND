const bookingModel = require('../models/booking')
const eventModel = require('../models/events')
const signupModel = require('../models/signup')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { eventCancell, eventApproved } = require('../utils/event')
const { bookingCompleteUser, bookingCompleteAgent } = require('../utils/bookingComplete')

let members = []

module.exports = (io) => {

    io.on('connection', (socket) => {

        console.log('Socket connected success');

        // create a function that add a new user object to Members array which has a userId and socketId
        socket.on('addMember', (memberId => {
            const socketObj = {
                socketId: socket.id,
                memberId,
            }
            const memberExist = members.find((members) => members.memberId == memberId)
            if (!memberExist) members.push(socketObj)
        }))

        socket.on('disconnect', () => {
            members = members.filter((user) => user.socketId !== socket.id)
        })

        try {
            //For event booking      
            socket.on('bookEvent', async (booking) => {
                const newData = new bookingModel(booking)
                const bookedEvent = await newData.save()

                const bookings = await bookingModel.aggregate([
                    {
                        $match: {
                            _id: bookedEvent._id
                        }
                    },
                    {
                        $lookup: {
                            from: "profiles",
                            localField: "user",
                            foreignField: "memberId",
                            as: 'userProfile'
                        }
                    }
                ]);

                const { agent } = bookedEvent
                const agentFound = members.find((members) => members.memberId == agent)
                if (agentFound) {
                    const { socketId } = agentFound
                    io.to(socketId).emit('fetchBooking', bookings)
                }
            })

            try {
                //For cancel event booking
                socket.on('cancelEvent', async (bookingId, userId) => {
                    const cancellEvent = await bookingModel.findOneAndUpdate({ _id: bookingId }, { $set: { isCancelled: true } }, { new: true })
                    if (cancellEvent.isCancelled) {
                        const user = await signupModel.findById(userId)
                        const { username, email } = user
                        eventCancell(username, email)
                    }
                    //For cancell pending modal when event rejected
                    const userFound = members.find((members) => members.memberId == userId)
                    if (userFound) {
                        const { socketId } = userFound
                        socket.to(socketId).emit('eventCancelled')
                    }
                })

            } catch (error) {
                console.log(error);
            }


            try {

                //For approve event booking
                socket.on('approveEvent', async (bookingId, userId) => {
                    const approveEvent = await bookingModel.findOneAndUpdate({ _id: bookingId }, { $set: { isConfirmed: true } }, { new: true })
                    if (approveEvent.isConfirmed) {
                        const user = await signupModel.findById(userId)
                        const { username, email } = user
                        eventApproved(username, email, approveEvent?.event?.venueName, approveEvent.selectedDate, approveEvent.amount)
                    }
                    //For cancell pending modal when event rejected
                    const userFound = members.find((members) => members.memberId == userId)
                    if (userFound) {
                        const { socketId } = userFound
                        socket.to(socketId).emit('eventApproved', approveEvent)
                    }
                })

            } catch (error) {
                console.log(error);
            }

            try {

                //For emailing after event completed
                socket.on('BOOKING_COMPLETED', async (bookedEvent) => {

                    //Emailing agent details to the user
                    const userId = bookedEvent.user
                    const agentId = bookedEvent.agent
                    const selectedDate = bookedEvent.selectedDate
                    const eventId = bookedEvent?.event?._id

                    const date = new Date(selectedDate);
                    const formatedDate = date.toString();

                    const findEvent = await eventModel.findById(eventId)
                    const availableDate = findEvent.availableDates

                    const newAvailableDate = availableDate.filter((date) => date !== formatedDate)
                    await eventModel.findOneAndUpdate({ _id: eventId }, { $set: { availableDates: newAvailableDate } }, { new: true })

                    const agentDetails = await signupModel.aggregate([
                        {
                            $match: {
                                _id: new ObjectId(agentId)
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "profiles",
                                localField: "_id",
                                foreignField: "memberId",
                                as: 'profile'
                            }
                        }])

                    const userDetails = await signupModel.aggregate([
                        {
                            $match: {
                                _id: new ObjectId(userId)
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "profiles",
                                localField: "_id",
                                foreignField: "memberId",
                                as: 'profile'
                            }
                        }])

                    bookingCompleteUser(bookedEvent, userDetails, agentDetails)
                    bookingCompleteAgent(bookedEvent, agentDetails, userDetails)

                })

            } catch (error) {
                console.log(error);
            }
            
        } catch (error) {
            console.log('Error in book event', error);
        }

    });

}
