const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectSocket = require('./utils/socket')
const app = express();

const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

const port = process.env.PORT
const user = require('./routes/user');
const agent = require('./routes/agent')
const admin = require('./routes/admin')

//Applying inbuilt middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//Linking router    
app.use('/api/admin', admin)
app.use('/api/agent', agent)
app.use('/api/', user);
 
connectSocket(io)

//Connecting mongodb
http.listen(port, () => console.log(`Listening on port ${port}`));
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('Databse Connected Failed', err))
