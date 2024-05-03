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
router.post('/complete-profile', upload.single('profile'), commonController.postCompleteProfile)

//ADMIN FUNCTIONALITIES
router.get('/users', verifyToken, adminController.getUsersList)
router.get('/agents', verifyToken, adminController.getAgentsList)
router.put('/block', verifyToken, adminController.postBlockUserAgent)
router.get('/messages', verifyToken, adminController.getMessages)
router.delete('/remove-message', verifyToken, adminController.deleteMessages)
router.get('/category', verifyToken, adminController.getCategory)
router.post('/add-category', verifyToken, upload.single('categoryImage'), adminController.postAddCategory)
router.post('/edit-category', verifyToken, upload.single('categoryImage'), adminController.posEditCategory)
router.put('/category-block', verifyToken, adminController.putBlockCategory)
router.get('/edit-category', verifyToken, adminController.getEditCategory)
router.post('/sort-messages', verifyToken, adminController.postSortMessages)
router.get('/dashboard', verifyToken, adminController.getAdminDashboard)

module.exports = router      