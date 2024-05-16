const Razorpay = require("razorpay");
const eventModel = require('../models/events')
const bookingModel = require('../models/booking')
const signupModel = require('../models/signup')
const profileModal = require('../models/profile')
const crypto = require('crypto');
const shortid = require("shortid");

exports.postPayment = async (req, res) => {

    const { advanceAmount, selectedDate, eventId } = req.body
    const userId = req.userId

    const findEvent = await eventModel.findById(eventId)

    // Initialize razorpay object
    const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });

    // Create an order -> generate the OrderID -> Send it to the Front-end
    const payment_capture = 1;
    const amount = parseInt(advanceAmount);
    const currency = "INR";
    const options = {
        amount: (amount * 100).toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        const booking = {
            orderId: response.id,
            currency: response.currency,
            amount: response.amount,
            event: findEvent,
            selectedDate,
            user: userId,
            agent: findEvent.agentId,
            isConfirmed: false,
            bookedDate: new Date()
        }

        console.log(booking);
        res.status(200).json(booking);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

}

exports.postPaymentCheck = async (req, res) => {
    try {

        const { response, booking } = req.body

        let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
        hmac.update(response.razorpay_order_id + '|' + response.razorpay_payment_id)
        hmac = hmac.digest('hex')

        if (hmac == response.razorpay_signature) {
            await bookingModel.create(booking)
            res.status(200).json({ msg: 'Payment succesfully completed and booking placed', success: true })
        } else {
            res.status(276).json({ msg: 'Payment failed', success: false })
        }

    } catch (error) {
        console.log('Error in post payment check', error);
        res.status(500).json({ msg: 'Internal server error', error })
    }
}  