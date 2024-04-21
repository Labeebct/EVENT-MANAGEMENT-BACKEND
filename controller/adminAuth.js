const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const signupModel = require('../models/adminSignup')
const adminSecretKey = process.env.ADMIN_SECRET
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.postSignup = async (req, res) => {
    try {

        //Regex to Validate
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
        res.status(500).json({msg:'Internal server error',error})
    }
}

exports.postForgetPassword = async (req, res) => {
    try {

        //Destructuring email and secret key from req.body
        const { email, secretkey } = req.body

        //Validating admin datas
        if (!email && !secretkey) res.status(422).json({ msg: 'Please fill all fields' })
        else if (!email) res.status(422).json({ msg: 'Please enter email' })
        else if (!emailRegex.test(email)) res.status(422).json({ msg: 'Incorrect email format' })
        else if (!secretkey) res.status(422).json({ msg: 'Please enter secretkey' })
        else {
            //Checking whether admin exist or not
            const adminExist = await signupModel.findOne({ email })
            if (adminExist) {

                //Checking secret key matcning or not
                if (secretkey == adminSecretKey) {
                    return res.status(200).json({ msg: 'Redirecting to password reset',email })
                } else {
                    return res.status(401).json({ msg: 'Incorrect secretkey' })
                }

            } else {
                return res.status(404).json({ msg: 'Admin with email not exist' })
            }
        }

    } catch (error) {
        console.log('Error in post forget password', error);
        res.status(500).json({msg:'Internal server error',error})
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
            return res.status(422).json({ msg: 'New password and confirm password mismatch' })
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
        console.log('Error in post reset password', error);
        res.status(500).json({msg:'Internal server error',error})
    }
}
