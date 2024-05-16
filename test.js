// const io = require('socket.io')(8000, {
//     cors: {
//         origin: 'http://localhost:5173'
//     }
// })

// io.on("connection", (socket)=>{
//     console.log("connected")

//     socket.on("hey", ()=>{
//         console.log("method")
//     })
// })

const express = require('express')
const app = express()

const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
app.use(cors(
    {
        
    }
))

const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", (socket)=>{
    console.log("connected")
})

server.listen(8000, ()=>{
    console.log("server connected")
})