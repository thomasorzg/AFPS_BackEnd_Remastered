module.exports = (app) => {
  const auth = require("../../middlewares/auth");

  const operators = require("../../controllers/automationControllers/operators.controller");

  var router = require("express").Router();

  router.post("/", operators.create);
  router.get("/", operators.operators);

  // With Authentication
  app.use("/operators", auth, router);
};
