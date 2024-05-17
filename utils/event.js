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

async function eventCancell(userName, userMail) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Your event booking has been rejected.",
            html: `
            <p>
            Dear ${userName.toUpperCase()},
        </p>
        <p>
            We regret to inform you that your event booking has been rejected due to a certain reason.
        </p>
        <p>
            After a thorough review, we found that the selected date and venue were already booked for another event, and unfortunately, we were unable to accommodate your request. We understand how important this event is to you, and we sincerely apologize for any inconvenience this may cause.
        </p>
        <p>
            We encourage you to consider rescheduling your event. Our team would be happy to assist you in finding an alternative date or venue that meets your requirements. Please contact our support team at your earliest convenience, and we will do our best to help you make the necessary arrangements.
        </p>
        <p>
            Additionally, if you have any questions or need further assistance, please do not hesitate to reach out to us. We are committed to providing you with the best possible service and support.
        </p>
        <p>
            Once again, we apologize for any inconvenience caused and appreciate your understanding and cooperation in this matter.
        </p>
        <p>
            Thank you for your continued support.
        </p>
        <p>
            Best regards,<br>
            Labeeb CT<br>
            LABIO Support Team
        </p>
        `
        });



    } catch (error) {
        console.log('Error in nodemailer', error.message);
    }
}

module.exports = { eventCancell }