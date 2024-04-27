const signupModel = require('../models/signup')
const adminSignupModel = require('../models/adminSignup')
const profileModel = require('../models/profile')
const messageModel = require('../models/messages')
const { Types, default: mongoose } = require('mongoose')

//Function to pass error
const errFunction = (statusCode, msg) => {
    return res.status(statusCode).json({ msg })
}

//Regex to Validate
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.postCompleteProfile = async (req, res) => {
    try {

        //Destructuring email to find the user
        const { email } = req.query
        const { role } = req.body
        if (!req.file) return res.status(422).json({ msg: 'Please provide a profile picture' })
        const imagePath = 'images/profile/' + req.file.filename

        //Checking whether profile exist for member 
        const profileExist = await profileModel.findOne({ email })
        if (profileExist && profileExist.role === role) return res.status(200).json({ msg: 'Profile already saved' })

        //creating validating messages
        const validationMsg = {
            fullname: "Please provide your Full Name.",
            mobilenum: "Please enter your Mobile Number.",
            dob: "Please specify your Date of Birth.",
            gender: "Please specify your Gender.",
            occupation: "Please enter your Occupation.",
            referalsource: "Please indicate your Referral Source.",
            state: "Please enter your State.",
            district: "Please provide your Pincode.",
            pincode: "Please provide your Pincode.",
            city: "Please enter your City.",
            landmark: "Please describe your Landmark.",
            houseno: "Please provide your House Number.",
        };
        for (const field of Object.keys(validationMsg)) {
            if (!req.body[field] || req.body[field].trim() === "") {
                return errFunction(422, validationMsg[field]);
            }
        }

        //Inserting id of current member whether its user , admin or agent
        if (role == 'admin') {
            const admin = await adminSignupModel.findOne({ email })
            const adminObjId = new mongoose.Types.ObjectId(admin._id);
            req.body.adminId = adminObjId
        } else if (role == 'agent') {
            const agent = await signupModel.findOne({ email })
            const agentObjId = new mongoose.Types.ObjectId(agent._id);
            req.body.agentId = agentObjId
        } else {
            const user = await signupModel.findOne({ email })
            const userObjId = new mongoose.Types.ObjectId(user._id);
            req.body.userId = userObjId
        }

        //Overriding profile to the image path which is created from req.file
        req.body.profile = imagePath
        req.body.email = email
        //Deleting frontent profile url
        delete req.body.profileUrl

        await profileModel.create(req.body)
        res.status(200).json({ msg: 'Profile saved success' })

    } catch (error) {
        console.log('Error in post complete profile', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postContactus = (req, res) => {
    try {

        //Destructuring datas from req.body
        const { username, email, message, subject ,role } = req.body

        // Validating user input datas
        if (username.trim() === '' || email.trim() === '' || message.trim() === '' || subject.trim() === '') errFunction(402, 'Please fill all fields')
        else if (!emailRegex.test(email)) errFunction(422, 'Invalid email format')

        messageModel.create(req.body)
        res.status(200).json({ msg: 'Message has been sended succesfully.' })

    } catch (error) {
        console.log("Error in post message", error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}