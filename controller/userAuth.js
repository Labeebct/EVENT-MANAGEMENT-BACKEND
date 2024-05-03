const bcrypt = require('bcrypt')
const otpGenerator = require('../utils/otpGenarator')
const profileModel = require('../models/profile')
const jwt = require('jsonwebtoken');
const signupModel = require('../models/signup')
const { signupEmailOtp, forgetPassEmail } = require('../utils/emailVerify')

let signupOTP;
let forgetPassOtp;

exports.postSignup = async (req, res) => {
    try {

        //Regex to Validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //Destructuring datas from body
        const { username, email, password, confirmpassword, role } = req.body

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
            const userExist = await signupModel.findOne({ email })

            //Calling OTP function to get random otp each type
            signupOTP = otpGenerator()

            if (userExist
            ) {

                //Checking whether user verified or not
                if (userExist.verified) return res.status(409).json({ msg: 'User already Exist', userExist: true })
                else {

                    //Telling the user that this is a unverified account and login to verify email with otp
                    return res.status(401).json({ msg: 'Account exist with this email Login to Verify', userVerified: false })
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
                signupEmailOtp(username, email, signupOTP)
                res.status(200).json({ msg: 'Registration success', registered: true, email })
            }

        }
    } catch (error) {
        console.log('Error in post signup', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postOtpverification = async (req, res) => {
    try {
        //Collecting email to find the user to verify
        const email = req.params.email

        //Destructuring otp values from body
        const { otpValue } = req.body

        //Validating otp
        if (otpValue.length == 0 || otpValue.length < 4) {
            return res.status(422).json({ msg: 'Please provide otp' })
        }

        //Checking whether user otp matches with created otp
        if (otpValue != signupOTP) {
            return res.status(409).json({ msg: 'Invalid OTP' })
        }
        else {
            //Verifying user if otp matches
            const veryfyUser = await signupModel.findOneAndUpdate({ email }, { $set: { verified: true } }, { new: true })

            //Making sure whether verification success or not
            if (veryfyUser.verified) return res.status(200).json({ msg: 'Verification success' })
            else return res.status(403).json({ msg: 'Verification Failed' })
        }

    } catch (error) {
        console.log('Error in post otp verification', error);
        res.status(500).json({ msg: 'Internal server error', error })
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
            return res.status(422).json({ msg: 'Invalid Email Format' })
        } else if (!passwordRegex.test(password)) {
            return res.status(422).json({ msg: 'Password should contains min 8 character' })
        }

        //Checking whether user exist or not
        const userExist = await signupModel.findOne({ email })

        if (userExist) {

            //Checking whether user active or blocked
            if (userExist.status == 'active') {
                //Checking whether existed user verified or not
                if (userExist.verified) {
                    //If user verified , checking the password match or not
                    const passwordMatch = await bcrypt.compare(password, userExist.password)

                    //Sending succuess msg if passord matches
                    if (passwordMatch) {

                        const payload = {
                            userId: userExist._id,
                            username: userExist.username,
                            role: userExist.role
                        }
                        const token = jwt.sign(payload, process.env.JWT_SECRET);

                        const profileExist = await profileModel.findOne({ email })
                        if (!profileExist) return res.status(202).json({ msg: 'Login Success', userExist })
                        res.status(200).json({ msg: 'Login Success', token })
                    
                    } else {
                        return res.status(401).json({ msg: 'Incorrect Password' })
                    }

                } else {
                    //If user not verified user will be redirected to otp verification
                    signupOTP = otpGenerator()
                    signupEmailOtp(userExist.username, email, signupOTP)
                    return res.status(403).json({ msg: 'Verification is Needed', email })
                }
            } else {
                return res.status(503).json({ msg: 'This account has been Blocked', email })
            }
        } else {
            //User not exist so passing 404 and passing the message
            return res.status(404).json({ msg: 'User with email not Exist' })
        }


    } catch (error) {
        console.log('Error in post login', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postForgetpassword = async (req, res) => {
    try {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //Destructuring email to check whether user exist or not
        const { email } = req.body

        //Checking whether email have values and meet email format
        if (!email) return res.status(422).json({ msg: 'Please Enter the email' })
        else if (!emailRegex.test(email)) return res.status(422).json({ msg: 'Invalid Email Format' })

        //Checking whether user exist with entered email
        const userExist = await signupModel.findOne({ email })

        if (userExist) {
            forgetPassOtp = otpGenerator()
            forgetPassEmail(userExist.username, email, forgetPassOtp)
            return res.status(200).json({ msg: 'Redirecting to OTP Verification' })
        }
        else return res.status(404).json({ msg: 'Account doesnt exist with Entered Email' })

    } catch (error) {
        console.log('Error in post forget password', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postForgetPasswordOtp = async (req, res) => {
    try {

        //Collecting email to find the user to verify
        const email = req.params.email

        //Destructuring otp values from body
        const { otpValue } = req.body

        //Validating otp
        if (otpValue.length == 0 || otpValue.length < 4) {
            return res.status(422).json({ msg: 'Please provide otp' })
        }

        //Checking whether user otp matches with created otp
        if (otpValue != forgetPassOtp) {
            return res.status(409).json({ msg: 'Invalid OTP' })
        }
        else {
            return res.status(200).json({ msg: 'Verification Success', email })
        }

    } catch (error) {
        console.log('Error in post otp verification otp');
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.postResetPassword = async (req, res) => {
    try {

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //Destructuring passwords from body
        const { oldPassword, newPassword, confirmPassword } = req.body

        //Collecting email to find the user to reset the password
        const email = req.query.email

        //Validating Password
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(422).json({ msg: 'Please fill all Fields' })
        } else if (!passwordRegex.test(newPassword)) {
            return res.status(422).json({ msg: 'Password should be 8+ chars, 1 uppercase, 1 digit, 1 special character' })
        } else if (newPassword != confirmPassword) {
            return res.status(422).json({ msg: 'Newpassword and confirm password mismatch' })
        }

        //Finding user with email
        const findUser = await signupModel.findOne({ email })

        if (findUser) {
            //Taking userold password to compare password
            const userOldPassword = findUser.password

            //Comparing password
            const passwordMatch = await bcrypt.compare(oldPassword, userOldPassword)
            if (passwordMatch) {
                //Salting and Hashing password
                const salt = await bcrypt.genSalt(10)
                const newHashedPassword = await bcrypt.hash(newPassword, salt)

                //Checking whether old password and new password are same
                const samePassword = await bcrypt.compare(newPassword, userOldPassword)
                if (samePassword) {
                    return res.status(409).json({ msg: 'Old password cannot be the same as the new password' })
                } else {

                    //Upating new password in the database
                    await signupModel.findOneAndUpdate({ email }, { $set: { password: newHashedPassword } }, { new: true })
                    return res.status(200).json({ msg: 'Password reset success' })
                }
            } else {
                return res.status(401).json({ msg: 'Incorrect old password' })
            }
        } else {
            //Passing 404 when user not exist
            return res.status(404).json({ msg: 'No user found with provided email' })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

exports.getResendOtp = async (req, res) => {
    try {
        const { email, type } = req.query

        //Calling function to create otp
        console.log('reached');
        const userExist = await signupModel.findOne({ email })

        if (type == 'login' || type == 'signup') {
            signupOTP = otpGenerator()
            signupEmailOtp(userExist.username, email, signupOTP)
        }
        else {
            forgetPassOtp = otpGenerator()
            forgetPassEmail(userExist.username, email, forgetPassOtp)
        }

    } catch (error) {
        console.log('Error in get ResendOtp', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

