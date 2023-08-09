require('dotenv').config();

const test_ = require('../../config/test.config');

triggerPhoneGateway = (phone, token) => {
    // You can add replace the payment gateway according to your choice
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const authSender = process.env.TWILIO_SENDER;

    if (!accountSid || !authToken || !authSender) {
        console.log("Please set Twilio in .env");
        throw TypeError("Please set Twilio in .env");
    }

    const client = require('twilio')(accountSid, authToken);

    try {
        client.messages
            .create({
                body: `Your verification code is ${token}.`,
                from: authSender,
                to: phone
            })
            .then(message => {
                return {
                    message: "The verification code has been sent."
                };
            });
    } catch (error) {
        throw TypeError(error.message);
    }
}

exports.sendOTP = async (phone, token) => {
    if (!phone) {
        throw TypeError("Phone number is required.");
    }

    if (test_.phone_otp_verification) {
        return {
            message: `Test OTP - ${token}. Gateway is disabled in Test Mode`
        };
    }

    triggerPhoneGateway(phone, token);

}