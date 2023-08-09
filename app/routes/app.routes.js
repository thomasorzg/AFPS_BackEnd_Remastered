// Create the custom routes in this file.
// Make sure you create a new controller for creating custom functions.

module.exports = (app) => {
  const auth = require("../middlewares/auth");

  // const Users = require("../../controllers/");

  var router = require("express").Router();

  // router.get("/", Users.get);

  app.use("/", auth, router);
};
