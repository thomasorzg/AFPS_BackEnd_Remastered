const cron = require("node-cron");
const twilio = require('twilio');

const testPhone = {
  start: () => {
    cron.schedule("* * * * *", async () => {
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_SENDER) {
        console.error("One or more Twilio credentials missing");
        return;
      }

      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
          body: "Test message",
          from: process.env.TWILIO_SENDER,
          to: "+526443234512"
        });
      } catch (error) {
        console.error(error);
      }
    });
  },
};

module.exports = testPhone;
