const bcrypt = require('bcrypt')
const otpGenerator = require('../utils/otpGenarator')
const jwt = require('jsonwebtoken');

const signupModel = require('../models/adminSignup')
const { signupEmailOtp, forgetPassEmail } = require('../utils/emailVerify')
const adminSecretKey = process.env.ADMIN_SECRET

let signupOTP;
let forgetPassOtp;

exports.postSignup = async (req, res) => {
    try {

        //Regex to Validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //Destructuring datas from body
        const { username, email, password, secretpassword } = req.body

        //Validating user datas
        if (!username, !email, !password) {
            return res.status(422).json({ msg: 'Please fill all fields' })
        }
        else if (username.trim().length < 4) {
            return res.status(422).json({ msg: 'Username should be more than 4 character' })
        }
        else if (!emailRegex.test(email)) {
            return res.status(422).json({ msg: 'Invalid email format' })
        }
        else if (!passwordRegex.test(password)) {
            return res.status(422).json({ msg: 'Please provide a strong password' })
        }
        else if (secretpassword != adminSecretKey) {
            return res.status(422).json({ msg: 'Incorrect secret key' })
        }
        else {

            //Checking whether user exist or not
            const userExist = await signupModel.findOne({ email })

            if (userExist) {
                return res.status(401).json({ msg: 'Account exist with this email', userVerified: false })
            } else {

                //Salting and Hashing password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)

                //Overriding the password to hashedpassword and saving datas in database
                req.body.password = hashedPassword
                delete req.body.secretkey
                await signupModel.create(req.body)

                //Sending success status
                res.status(200).json({ msg: 'Registration success', registered: true })
            }

        }
    } catch (error) {
        console.log('Error in post signup', error);
        res.status(500).send('Internal server error', error)
    }
}

exports.postLogin = async (req, res) => {
    try {

        //Regex for validating entering datas
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /.{8,}/

        //Destructuring  login datas
        const { email, password } = req.body

        //Validating login datas
        if (!email, !password) {
            return res.status(422).json({ msg: 'Please Fill all fields' })
        } else if (!email) {
            return res.status(422).json({ msg: 'Please Enter the Email' })
        } else if (!password) {
            return res.status(422).json({ msg: 'Please Enter the Password' })
        } else if (!emailRegex.test(email)) {
            return res.status(422).json({ msg: 'Invalid Email format' })
        } else if (!passwordRegex.test(password)) {
            return res.status(422).json({ msg: 'Password should contains min 8 character' })
        }

        //Checking whether user exist or not
        const userExist = await signupModel.findOne({ email })

        if (userExist) {

            //Checking the password match or not
            const passwordMatch = await bcrypt.compare(password, userExist.password)

            //Sending succuess msg if passord matches
            if (passwordMatch) {
                const payload = {
                    userId: userExist._id,
                    username: userExist.username,
                    role: 'admin'
                }
                const token = jwt.sign(payload, process.env.JWT_SECRET);
                res.status(200).json({ msg: 'Login Success', token })
                //return res.status(200).json({msg:'Login Success'})
            } else {
                return res.status(401).json({ msg: 'Incorrect password' })
            }

        } else {
            //User not exist so passing 404 and passing the message
            return res.status(404).json({ msg: 'User with email not exist' })
        }


    } catch (error) {
        console.log('Error in post login', error);
        res.status(500).send('Internal server error')
    }
}