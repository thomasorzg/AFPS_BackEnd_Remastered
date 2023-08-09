module.exports = app => {

  const auth = require("../../middlewares/auth");

  const authenticated = require("../../controllers/automationControllers/authenticated.controller");

  var router = require("express").Router();

  router.put("/:document/profile", authenticated.updateProfile);

  router.put("/:document/password", authenticated.updatePassword);

  app.use("/authenticated/", auth, router);

};