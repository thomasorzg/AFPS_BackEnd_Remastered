module.exports = app => {

  const auth = require("../../middlewares/auth");

  const email = require("../../controllers/automationControllers/email.controller");

  var router = require("express").Router();

  router.post("/", auth, email.trigger);

  app.use("/email/", router);

};