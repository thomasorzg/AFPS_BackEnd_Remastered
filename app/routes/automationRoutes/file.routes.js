module.exports = app => {

  const auth = require("../../middlewares/auth");

  const file = require("../../controllers/automationControllers/file.controller");

  var router = require("express").Router();

  router.get("/download/:name", file.download);
  router.get("/image/:name", file.getImage);
  
  router.post("/photo", auth, file.upload);

  app.use("/file/", router);

};