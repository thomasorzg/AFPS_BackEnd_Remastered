module.exports = (app) => {
  const auth = require("../../middlewares/auth");

  const users = require("../../controllers/automationControllers/users.controller");

  var router = require("express").Router();

  router.post("/", users.create);
  router.get("/", users.users);

  // With Authentication
  app.use("/users", auth, router);
};
