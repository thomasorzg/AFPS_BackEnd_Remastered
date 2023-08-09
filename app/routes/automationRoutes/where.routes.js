module.exports = app => {
  const auth = require("../../middlewares/auth");
  const where = require("../../controllers/automationControllers/where.controller");

  var router = require("express").Router();

  router.post("/:document/and", where.findAnd);

  router.post("/:document/or", where.findOr);

  app.use('/where/', auth, router);
};