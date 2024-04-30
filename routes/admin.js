const express = require('express')
const router = express.Router()
const adminAuth = require('../controller/adminAuth')
const commonController = require('../controller/common')
const adminController = require('../controller/admin')
const verifyToken = require('../middleware/verifyTokens')


//Multer configuration
const upload = require('../middleware/multer')

//ADMIN AUTHENTICATION
router.post('/signup', adminAuth.postSignup)
router.post('/login', adminAuth.postLogin)
router.post('/forget-password', adminAuth.postForgetPassword)
router.post('/reset-password', adminAuth.postResetPassword)
router.post('/complete-profile',upload.single('profile'),commonController.postCompleteProfile)

//ADMIN FUNCTIONALITIES
router.get('/users',adminController.getUsersList)
router.get('/agents',adminController.getAgentsList)
router.put('/block',adminController.postBlockUserAgent)
router.get('/messages',adminController.getMessages)
router.delete('/remove-message',adminController.deleteMessages)
router.get('/category',adminController.getCategory)
router.post('/add-category',upload.single('categoryImage'),adminController.postAddCategory)
router.post('/edit-category',upload.single('categoryImage'),adminController.posEditCategory)
router.put('/category-block',adminController.putBlockCategory)
router.get('/edit-category',adminController.getEditCategory)
router.post('/sort-messages',adminController.postSortMessages)

module.exports = router      