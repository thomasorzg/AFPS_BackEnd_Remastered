module.exports = (app) => {
    const auth = require("../../middlewares/auth");

    const incubators = require("../../controllers/automationControllers/incubators.controller");

    var router = require("express").Router();

    router.post("/", incubators.create);
    router.get("/", incubators.incubators);
    
    // With Authentication
    app.use("/incubators", auth, router);
};