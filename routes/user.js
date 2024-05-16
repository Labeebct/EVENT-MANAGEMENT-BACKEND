const express = require('express');
const router = express.Router();
const commonController = require('../controller/common')
const verifyToken = require('../middleware/verifyTokens')
const paymentController = require('../controller/payment')
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
router.get('/events', userController.getEventsList)
router.post('/contact', commonController.postContactus)

//ADMIN HOME
router.get('/category', userController.getCategory)
router.get('/view-event', userController.getViewEvent)

//PROTECTED
router.get('/profile',verifyToken, commonController.getProfile)
router.post('/payment', verifyToken, paymentController.postPayment)
router.post('/payment-check', verifyToken, paymentController.postPaymentCheck)

module.exports = router;
