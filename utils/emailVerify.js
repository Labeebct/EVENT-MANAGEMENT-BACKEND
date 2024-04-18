const nodemailer = require("nodemailer");

//Retrieving data from dot env
const sendingEmail = process.env.GMAIL
const appPassword = process.env.APP_PASSWORD

//Setting the gmail and app password
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sendingEmail,
        pass: appPassword,
    },
});

async function signupEmailOtp(userName, userMail, otp) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Account Verification: Your One-Time Passcode (OTP)",
            html: `
            <p>
                Dear ${userName},
            </p>
            <p>
                Your 4 digits OTP for your account verification is
            </p>
            <p style="font-size: 35px; text-align:centre; margin:8px 0; font-weight:500; padding-left:.1rem;">
                  ${otp}
            </p>
            <p>
                Please safeguard this OTP and avoid sharing it with anyone. It's crucial for completing the verification process securely.
            </p>
            <p>
                If you didn't initiate this verification request or have any concerns, please contact our support team immediately at <a href="mailto:labiocare@gmail.com">labiocare@gmail.com</a>.
            </p>
            <p>
                Thank you for your attention to this matter.
            </p>
            <p>
                Best regards,<br> 
                Labeeb ct<br>
                LABIO Support Team
            </p>`
        });



    } catch (error) {
        console.log('Error in nodemailer', error.message);
    }
}


async function forgetPassEmail(userName, userMail, otp) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Password Reset Confirmation: Your One-Time Passcode (OTP)",
            html: `
            <p>
                Dear ${userName},
            </p>
            <p>
                Your 4 digits OTP for your account password reset is
            </p>
            <p style="font-size: 35px; text-align:centre; margin:8px 0; font-weight:500; padding-left:.1rem;">
                  ${otp}
            </p>
            <p>
                Please safeguard this OTP and avoid sharing it with anyone. It's crucial for completing the password resetting process securely.
            </p>
            <p>
                If you didn't initiate this password reset request or have any concerns, please contact our support team immediately at <a href="mailto:labiocare@gmail.com">labiocare@gmail.com</a>.
            </p>
            <p>
                Thank you for your attention to this matter.
            </p>
            <p>
                Best regards,<br>
                Labeeb ct<br>
                LABIO Support Team
            </p>`
        });


    } catch (error) {
        console.log('Error in nodemailer', error.message);
    }
}


module.exports = {signupEmailOtp,forgetPassEmail}