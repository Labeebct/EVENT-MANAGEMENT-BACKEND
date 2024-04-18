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

async function blockUser(userName, userMail) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Your Labio Account has Been BLOCKED",
            html: `
            <p>
                Dear ${userName},
            </p>
            <p>
                We regret to inform you that your access to Labio has been BLOCKED.
            </p>
            <p>
                Upon reviewing your account activity, we have detected unusual behavior that violates our terms of service or security policies. As a result, we have taken the necessary steps to protect our platform and our users by temporarily blocking your access.
            </p>
            <p>
                Please note that this action is taken to ensure the integrity and security of LabioMart for all users. We take such matters seriously to maintain a safe and trustworthy environment for our community.
            </p>
            <p>
                If you believe that your account has been blocked in error or if you have any questions regarding this action, please don't hesitate to contact our support team at <a href="mailto:labiocare@gmail.com">labiocare@gmail.com</a> or by replying to this email. Our team will be happy to assist you in resolving this matter as soon as possible.
            <p/>
            <p>
                Thank you for your understanding and cooperation.
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



async function unblockUser(userName, userMail) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Your Labio Account has Been UNBLOCKED",
            html: `
            <p>
                Dear ${userName},
            </p>
            <p>
               We are pleased to inform you that your Labio account has been successfully UNBLOCKED.
            </p>
            <p>
              After a thorough review of your account activity, we have reinstated your access to LabioMart. We apologize for any inconvenience this temporary block may have caused and appreciate your patience and understanding during this process.
            </p>
            <p>
              We value you as a member of our community and are committed to providing you with the best possible experience on our platform. If you have any further questions or concerns, please don't hesitate to reach out to our support team at <a href="mailto:labiocare@gmail.com">labiocare@gmail.com</a>. We are here to assist you with any assistance you may need.
            </p>
            <p>
            Thank you for choosing LabioMart. We look forward to serving you again soon!
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


module.exports = {blockUser,unblockUser}