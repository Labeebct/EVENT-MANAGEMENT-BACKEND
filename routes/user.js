const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyTokens')

//Multer configuration
const upload = require('../middleware/multer')

const userController = require('../controller/user')
const userAuth = require('../controller/userAuth')

//USER AUTHENTICATION
router.post('/signup',userAuth.postSignup)



module.exports = router;
                 