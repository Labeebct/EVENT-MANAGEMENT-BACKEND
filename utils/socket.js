const bookingModel = require('../models/booking')

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
            console.log(members);
        }))

        socket.on('disconnect', ()=>{
            members = members.filter((user) => user.socketId !== socket.id)
        })
 
        try {
            //For event booking 
            socket.on('bookEvent', (booking) => {
                bookingModel.create(booking).then((booking) => {
                    const { agent } = booking
                    const agentFound = members.find((members) => members.memberId == agent)
                    if (agentFound) {
                        const { socketId } = agentFound
                        console.log('emitted');
                        io.to(socketId).emit('fetchBooking', booking)
                    }
                })   
            })
        } catch (error) {
            console.log('Error in book event', error);
        }

    });

}



