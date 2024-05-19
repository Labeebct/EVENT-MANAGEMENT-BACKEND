const bookingModel = require('../models/booking')
const signupModel = require('../models/signup')
const { eventCancell, eventApproved } = require('../utils/event')

let members = []

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('Socket connected success');

        // create a function that add a new user object to Members array which has a userId and socketId
        socket.on('addMember', (memberId => {
            console.log(memberId)
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
                        socket.to(socketId).emit('eventApproved',approveEvent)
                    }
                })

            } catch (error) {
                console.log(error);
            }

        } catch (error) {
            console.log('Error in book event', error);
        }

    });

}
