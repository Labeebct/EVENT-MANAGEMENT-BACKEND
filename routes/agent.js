const express = require('express')
const router = express.Router()
const agentController = require('../controller/agent')
const verifyToken = require('../middleware/verifyTokens')

//Multer configuration
const upload = require('../middleware/multer')

router.post('/add-events', verifyToken, upload.single('venueImage'), agentController.postAddEvents)

module.exports = router      