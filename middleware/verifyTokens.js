const jwt = require('jsonwebtoken')
const signupModel = require('../models/signup')
const adminSignupModel = require('../models/adminSignup')

const verifyToken = async (req, res, next) => {
    try {

        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ msg: 'Access denied,token is missing' })

        const token = authHeader.split(' ')[1]

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET)

            const member = await signupModel.findById(verified.userId) || await adminSignupModel.findById(verified.adminId)

            if (member && member.role && member.role == 'agent') {
                req.agent = member
                req.agentId = member._id
            } else if (member && member.role && member.role == 'user') {
                req.user = member
                req.userId = member._id
            } else {
                req.admin = member
                req.adminId = member
            }

            next()

        } catch (error) {
            console.log('Invalid token', error);
        }

    } catch (error) {
        console.log('Error in json token verification', error);
    }
}

module.exports = verifyToken