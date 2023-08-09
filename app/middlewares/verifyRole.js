const jwt = require("../helpers/jwt");
const db = require("../models");

const verifyRole = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    jwt.accessTokenDecode(async (result) => {
      if (result.status) {
        const decoded = result.data;
        const role = decoded.role;

        console.log(role);
        const user = await db.users.findOne({
            where: {
              role: role
            }
        });

        if ([].concat(roles).includes(user.role)) {
          next();
        } else {
          return res.status(409).send({
            message: "Unauthorized!",
          });
        }
      } else {
        return res.status(result.code).send({
          message: result.message,
        });
      }
    }, token);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = verifyRole;
