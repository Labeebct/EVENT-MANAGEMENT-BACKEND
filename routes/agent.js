const express = require('express')
const router = express.Router()
const agentController = require('../controller/agent')
const verifyToken = require('../middleware/verifyTokens')

//Multer configuration
const upload = require('../middleware/multer')

router.post('/add-events', verifyToken, upload.single('venueImage'), agentController.postAddEvents)
router.post('/edit-events', verifyToken, upload.single('venueImage'), agentController.postEditEvents)
router.delete('/remove-available-dates',verifyToken,agentController.deleteRemoveAvailableDate)
router.get('/edit-event',verifyToken,agentController.getEditEvents)
router.get('/my-events',verifyToken,agentController.getMyEvents)
router.put('/event-block',verifyToken,agentController.putBlockCategory)

module.exports = router      