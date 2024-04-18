const bcrypt = require('bcrypt')
const otpGenerator = require('../utils/otpGenarator')
const jwt = require('jsonwebtoken');

const signupModel = require('../models/signup')
const {signupEmailOtp , forgetPassEmail} = require('../utils/emailVerify')

let signupOTP;
let forgetPassOtp;

exports.postSignup = async (req, res) => {
    try {

        //Regex to Validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //Destructuring datas from body
        const { username, email, password, confirmpassword } = req.body

        //Validating user datas
        if (!username, !email, !password, !confirmpassword) {
            return res.status(422).json({ msg: 'Please fill all fields' })
        }
        else if (username.trim().length < 4) {
            return res.status(422).json({ msg: 'username should be more than 4 character' })
        }
        else if (!emailRegex.test(email)) {
            return res.status(422).json({ msg: 'Invalid email format' })
        }
        else if (!passwordRegex.test(password)) {       
            return res.status(422).json({ msg: 'Please provide a strong password' })
        }
        else if (password !== confirmpassword) {
            return res.status(422).json({ msg: 'Password mismatch' })
        }
        else {

            //Checking whether user exist or not
            const userExist = await signupModel.findOne({email})

            //Calling OTP function to get random otp each type
            signupOTP = otpGenerator()

            if(userExist) {
                
                //Checking whether user verified or not
                if(userExist.verified) return res.status(409).json({msg:'User already Exist',userExist:true})   
                else{

                //Telling the user that this is a unverified account and login to verify email with otp
                return res.status(401).json({msg:'Account exist with this email Login to Verify',userVerified:false})   
                }
            } else {

            //Salting and Hashing password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //Overriding the password to hashedpassword and saving datas in database
            req.body.password = hashedPassword
            delete req.body.confirmpassword
            await signupModel.create(req.body)

            //Sending otp to user email for verification and passing success msg to frontent after saving user data
            signupEmailOtp(username,email,signupOTP)
            res.status(200).json({msg: 'Registration success',registered:true,email})
            }

        }
    } catch (error) {
        console.log('Error in post signup',error);
        res.status(500).send('Internal server error',error)
    }
}
