const express = require('express');
const router = express.Router();
const commonController = require('../controller/common')
const verifyToken = require('../middleware/verifyTokens')
const userController = require('../controller/user')
const userAuth = require('../controller/userAuth')

//Multer configuration
const upload = require('../middleware/multer')

//USER AUTHENTICATION
router.post('/signup', userAuth.postSignup)
router.post('/otp-verification/:email', userAuth.postOtpverification)
router.post('/login', userAuth.postLogin)
router.post('/forget-password', userAuth.postForgetpassword)
router.post('/forget-otp-verification/:email', userAuth.postForgetPasswordOtp)
router.post('/reset-password', userAuth.postResetPassword)
router.get('/resend-otp', userAuth.getResendOtp)
router.post('/complete-profile', upload.single('profile'), commonController.postCompleteProfile)
router.get('/profile', commonController.getProfile)
router.get('/events',userController.getEventsList)
router.post('/contact', commonController.postContactus)

//ADMIN HOME
router.get('/category',userController.getCategory)
router.get('/view-event',userController.getViewEvent)

module.exports = router;
