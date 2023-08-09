module.exports = app => {
  const auth = require("../../middlewares/auth");

  const crud = require("../../controllers/automationControllers/crud.controller");

  var router = require("express").Router();

  router.post("/:document", crud.create);

  router.get("/:document", crud.findAll);

  router.get("/:document/:id", crud.findOne);

  router.put("/:document/:id", crud.update);

  router.delete("/:document/:id", crud.delete);

  router.delete("/:document", crud.deleteAll);

  // Without Authentication
  // app.use("/crud", router);

  // With Authentication
  app.use("/crud", auth, router);
};