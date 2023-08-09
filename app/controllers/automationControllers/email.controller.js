const email_gateway = require("../../helpers/email-gateway");

exports.trigger = async (req, res) => {
  try {
    const response = await email_gateway.trigger(req.body);

    if (response) {
      res.send({
        message:
          "An email has been sent. Please check the spam. If email is not received in Inbox.",
      });
    } else {
      res.status(401).send({
        message: response,
      });
    }
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
  }
};