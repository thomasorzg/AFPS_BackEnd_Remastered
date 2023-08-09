require("dotenv").config();

const moment = require('moment-timezone');
const timezone = moment.tz.guess();

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    timezone: timezone,
    /* dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }, */

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// This model is required. Please don't delete.
db.tokens = require("./tokens.model.js")(sequelize, Sequelize);
//---------

db.users = require("./users.model.js")(sequelize, Sequelize);
db.operators = require("./operators.model.js")(sequelize, Sequelize);
db.incubators = require("./incubators.model.js")(sequelize, Sequelize);

sequelize.sync().then(async () => {
  const anyPassword = "admin123";
  const hashPassword = await bcrypt.hash(String(anyPassword), 10);

  const adminUser = await db.users.findOne({
    where: {
      id: 1,
    },
  });

  if (!adminUser) {
    await db.users.create({
      name: "Admin",
      email: "admin@admin.com",
      password: hashPassword,
      role: "ADMIN"
    });
  } else {
    console.log("Admin already exists");
  }

  const operator = await db.operators.findOne({
    where: {
      id: 1,
    },
  });

  if (!operator) {
    await db.operators.create({
      name: "Thomas Francisco Orozco Galindo",
      address: "Vicente Padilla 437",
      phone: "6441715719",
      email: "",
      gender: "MALE",
      status: "ACTIVE",
      ine: "",
      proofOfAddress: ""
    });
  } else {
    console.log("Operator already exists");
  }

  const incubator = await db.incubators.findOne({
    where: {
      id: 1
    }
  });

  if (!incubator) {
    await db.incubators.create({
      name: "Incubadora Test",
      serie: "DHT0323243345XLT",
      model: "Schumberger",
      operatorId: 1,
      status: "ACTIVE"
    });
  } else {
    console.log("Incubator already exists");
  }
}).catch((error) => {
  console.log(error);
});

module.exports = db;