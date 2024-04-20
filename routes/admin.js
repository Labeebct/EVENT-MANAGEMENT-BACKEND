const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')
const adminController = require('../controller/admin')
const verifyToken = require('../middleware/verifyTokens')


//Multer configuration
const upload = require('../middleware/multer')

//ADMIN AUTHENTICATION
router.post('/signup', adminAuth.postSignup)
router.post('/login', adminAuth.postLogin)
router.post('/forget-password', adminAuth.postForgetPassword)
router.post('/reset-password', adminAuth.postResetPassword)

module.exports = router  