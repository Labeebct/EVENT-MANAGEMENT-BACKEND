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

async function bookingCompleteUser(bookedEvent, userDetails, agentDetails) {

   const { username, email } = userDetails[0]

   const profile = agentDetails?.[0]?.profile?.[0]
   const event = bookedEvent.event

   try {
      await transporter.sendMail({
         from: sendingEmail,
         to: email,
         subject: "Your Event booking has been completed.",
         html: `
            <p>Dear ${username.toUpperCase()},</p>
<p>We're thrilled to inform you that your event at <strong>${event.venueName.toUpperCase()}</strong> on <strong>${bookedEvent.selectedDate}</strong> with an advance payment of ₹${bookedEvent.amount} has been successfully booked.</p>
<p>Below are the details of your assigned agent:</p>
<ul>
    <li><strong>Name:</strong> ${profile.fullname}</li>
    <li><strong>Phone:</strong> ${profile.mobilenum}</li>
    <li><strong>Email:</strong> ${profile.email}</li>
    <li><strong>Location:</strong> ${profile.state}, ${profile.district}, ${profile.city}</li>
</ul>
<p>You can reach out to your agent using the provided contact information. If you have any questions or need further assistance, feel free to contact us directly.</p>
<p>Our customer support team is dedicated to ensuring your experience with us is seamless and enjoyable. Your satisfaction is our top priority.</p>
<p>We value your feedback, which helps us continue delivering exceptional experiences. Thank you for choosing our services!</p>
<p>If you have any immediate concerns, please contact our customer support team.</p>
<p>Best regards,<br>Labeeb CT<br>LABIO Support Team</p>
        `
      });



   } catch (error) {
      console.log('Error in nodemailer', error);
   }
}

async function bookingCompleteAgent(bookedEvent, agentDetails, userDetails) {

   const { username, email } = agentDetails[0]

   const profile = userDetails?.[0]?.profile?.[0]

   const event = bookedEvent.event

   try {
      await transporter.sendMail({
         from: sendingEmail,
         to: email,
         subject: "Congratulation, You have new booking.",
         html: `
         <p>Dear ${username.toUpperCase()},</p>
         <p>We are pleased to inform you that a new event booking has been successfully completed:</p>
         <ul>
             <li><strong>Venue:</strong> ${event.venueName.toUpperCase()}</li>
             <li><strong>Selected Date:</strong> ${bookedEvent.selectedDate}</li>
             <li><strong>Advance Paid:</strong> ₹${bookedEvent.amount}</li>
         </ul>
         <p>And you have been assigned as the agent for this event. Below are the details of the client and the event:</p>
         <ul>
             <li><strong>Name:</strong> ${profile.fullname}</li>
             <li><strong>Phone:</strong> ${profile.mobilenum}</li>
             <li><strong>Email:</strong> ${profile.email}</li>
             <li><strong>Gender:</strong> ${profile.gender}</li>
             <li><strong>Location:</strong> ${profile.state}, ${profile.district}, ${profile.city}</li>
         </ul>
         <p>Please reach out to the client using the provided contact information to introduce yourself and discuss the event details. As their primary point of contact, your role will be crucial in ensuring the success of their event.</p>
         <p>If you have any questions or require additional information, please do not hesitate to contact us. We are here to support you and ensure that both you and the client have a positive and seamless experience.</p>
         <p>Thank you for your dedication and professionalism. We are confident that your expertise will contribute greatly to the success of this event.</p>
         <p>Best regards,<br>Labeeb CT<br>LABIO Support Team</p>
         `
      });



   } catch (error) {
      console.log('Error in nodemailer', error);
   }
}

module.exports = { bookingCompleteUser, bookingCompleteAgent }