const express = require("express");
const cors = require("cors");

const app = express();
const session = require('express-session');

global.__basedir = __dirname;

const cors_ = require("./app/config/cors.config");
var corsOptions = {
  origin: cors_.allowed_origins
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'nothing'
}));

const db = require("./app/models");

async function testConnection() {
  try {
    await db.sequelize.authenticate();

    await db.sequelize.sync();

    console.log("Connected to Database.");

  } catch (e) {
    console.log(e.message);
  }
}

testConnection();

app.get("/", (req, res) => {
  res.json({ message: "AFPS" });
});

require("./app/routes/automationRoutes/auth.routes")(app);
require("./app/routes/automationRoutes/social.routes")(app);
require("./app/routes/automationRoutes/authenticated.routes")(app);
require("./app/routes/automationRoutes/crud.routes")(app);
require("./app/routes/automationRoutes/where.routes")(app);
require("./app/routes/automationRoutes/file.routes")(app);
require("./app/routes/automationRoutes/email.routes")(app);
require("./app/routes/automationRoutes/rel.routes")(app);
require("./app/routes/automationRoutes/users.routes")(app);
require("./app/routes/automationRoutes/operators.routes")(app);
require("./app/routes/automationRoutes/incubators.routes")(app);
require("./app/routes/app.routes")(app);

// Cron jobs
/* const testPhone = require('./app/cron-jobs/testPhone'); */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);

  // Launch cron jobs
  /* testPhone.start(); */
});
