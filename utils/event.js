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
            subject: "Your Event booking has been Rejected.",
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

async function eventApproved(userName, userMail, venueName, selectedDate, advanceAmount) {

    try {
        await transporter.sendMail({
            from: sendingEmail,
            to: userMail,
            subject: "Your Event booking has been Approved.",
            html: `
            <p>
            Dear ${userName.toUpperCase()},
        </p>
    <p>
        We are pleased to inform you that your event booking has been successfully approved.
    </p>
    <p>
        After reviewing your request, we have confirmed the availability of the selected date and venue. We are excited to accommodate your event and look forward to making it a memorable experience for you and your guests.
    </p>
    <p>
        Please find the details of your booking below:
    </p>
    <ul>
        <li><strong>Venue:</strong> ${venueName.toUpperCase()}</li>
        <li><strong>Date:</strong> ${selectedDate}</li>
        <li><strong>Advance:</strong> ₹${advanceAmount}</li>
    </ul>
    <p>
        To secure your booking, please proceed with the payment of the advance amount. You can make the payment through our online payment portal or by contacting our support team for alternative payment methods. Once the payment is received, we will send you a confirmation receipt.
    </p>
    <p>
        If you need to make any changes to your booking or have any special requirements, please do not hesitate to contact our support team. We are here to assist you with any questions or additional arrangements you may need.
    </p>
    <p>
        We are committed to providing you with the best possible service and support. Should you require any further assistance, please feel free to reach out to us at any time.
    </p>
    <p>
        Thank you for choosing our services. We look forward to hosting your event.
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

module.exports = { eventCancell, eventApproved }