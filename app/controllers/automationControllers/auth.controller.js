const jwt = require("../../helpers/jwt");
const phone_gateway = require("../../helpers/phone-gateway");
const email_gateway = require("../../helpers/email-gateway");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../../models");
const Op = db.Sequelize.Op;

exports.loginAuth = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Email & Password required.",
      });
      return;
    }

    var condition = {
      where: {
        [Op.or]: [
          {
            email: req.body.email,
          },
        ],
      },
    };

    const data = await db[req.params.document].findOne(condition);

    if (!data) {
      res.status(400).send({
        message: "Email not found.",
      });
    } else {
      const match = await bcrypt.compare(req.body.password, data.password);
      
      if (match) {
        const payload = {
          id: data.id,
          role: data.role,
        };

        res.send({
          access_token: jwt.accessTokenEncode(payload),
          refresh_token: jwt.refreshTokenEncode(payload),
          user: data,
        });
      } else {
        res.status(400).send({
          message: "Incorrect password",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuth = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Email & Password required.",
      });
      return;
    }

    var condition = {
      where: {
        [Op.and]: [
          {
            email: req.body.email,
          },
        ],
      },
    };

    const user = await db[req.params.document].findOne(condition);

    if (user) {
      res.status(400).send({
        message: "Email already in use.",
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds, async function (error, hash) {
        req.body.password = hash;
        const users = new db[req.params.document](req.body);
        const data = await users.save(users);

        res.send({
          access_token: jwt.accessTokenEncode(data.id),
          refresh_token: jwt.refreshTokenEncode(data.id),
          user: data,
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.accessToken = async (req, res) => {
  if (!req.body.access_token) {
    res.status(400).send({
      message: "Access token is required.",
    });
    return;
  }

  jwt.accessTokenDecode(async function (e) {
    if (e.status) {
      try {
        const user = await db[req.params.document].findByPk(e.data.id);
        if (!user) {
          res.status(404).send({
            message: "No user found.",
          });
        } else {
          res.send(user);
        }
      } catch (error) {
        res.status(500).send({
          message: error.message || "Something went wrong.",
        });
      }
    } else {
      res.status(e.code).send({
        message: e.message,
      });
    }
  }, req.body.access_token);
};

exports.refreshToken = async (req, res) => {
  if (!req.body.refresh_token) {
    res.status(400).send({
      message: "Refresh token is required.",
    });
    return;
  }

  jwt.refreshTokenDecode(function (e) {
    if (e.status) {
      res.send({
        access_token: jwt.accessTokenEncode(e.data.id),
        refresh_token: jwt.refreshTokenEncode(e.data.id),
      });
    } else {
      res.status(e.code).send({
        message: e.message,
      });
    }
  }, req.body.refresh_token);
};

exports.sendResetCodeInEmail = async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).send({
        message: "Email required.",
      });
      return;
    }

    var condition = {
      where: {
        [Op.or]: [
          {
            email: req.body.email,
          },
        ],
      },
    };

    const data = await db[req.params.document].findOne(condition);

    if (!data) {
      res.status(400).send({
        message: "Email not found.",
      });
    } else {
      req.body.token = Math.floor(1000 + Math.random() * 9000);
      data.token = req.body.token;

      const result = await email_gateway.forgotPassword(data);

      if (result) {
        const tokens = new db["tokens"](req.body);
        await tokens.save(tokens);
        res.send({
          message: "Verification code has been sent.",
          email: req.body.email,
        });
      } else {
        res.status(401).send({
          message: result,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.token) {
      res.status(400).send({
        message: "Email & Password & Verification code is required.",
      });
      return;
    }

    var condition = {
      where: {
        [Op.and]: [
          {
            email: req.body.email,
          },
          {
            token: req.body.token,
          },
        ],
      },
    };

    const token_data = await db["tokens"].findOne(condition);

    if (!token_data) {
      res.status(400).send({
        message: "Verification code is invalid.",
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds, async function (error, hash) {
        req.body.password = hash;
        const data = await db[req.params.document].update(
          { password: req.body.password },
          { where: { email: req.body.email } }
        );

        await db["tokens"].destroy({
          where: { id: token_data.id },
        });

        res.send({
          message: "Password has been updated. Now you can login.",
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithPhone = async (req, res) => {
  try {
    if (!req.body.phone) {
      res.status(400).send({
        message: "Phone is required.",
      });
      return;
    }

    req.body.token = Math.floor(1000 + Math.random() * 9000);

    const result = await phone_gateway.sendOTP(req.body.phone, req.body.token);
    if (result) {
      const tokens = new db["tokens"]({
        token: req.body.token,
        phone: req.body.phone,
      });
      await tokens.save(tokens);

      const auth_data = await db[req.params.document].findOne({
        where: {
          [Op.and]: {
            phone: req.body.phone,
          },
        },
      });
      if (auth_data) {
        res.send({
          message: result.message,
          phone: req.body.phone,
        });
      } else {
        const users = new db[req.params.document](req.body);
        await users.save(users);
        res.send({
          message: result.message,
          phone: req.body.phone,
        });
      }
    } else {
      res.status(401).send({
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithPhoneVerify = async (req, res) => {
  try {
    if (!req.body.phone || !req.body.token) {
      res.status(400).send({
        message: "Phone & Verification code is required.",
      });
      return;
    }

    var condition = {
      where: {
        [Op.and]: {
          phone: req.body.phone,
          token: req.body.token,
        },
      },
    };

    const token_data = await db["tokens"].findOne(condition);

    if (token_data) {
      const auth_data = await db[req.params.document].findOne({
        where: {
          [Op.and]: {
            phone: req.body.phone,
          },
        },
      });
      if (auth_data) {
        await db["tokens"].destroy({
          where: { phone: token_data.phone },
        });

        res.send({
          access_token: jwt.accessTokenEncode(auth_data),
          refresh_token: jwt.refreshTokenEncode(auth_data),
          user: auth_data,
        });
      } else {
        res.status(400).send({
          message: "No user has been found.",
        });
      }
    } else {
      res.status(400).send({
        message: "The verification code did not match.",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const { userId } = req.query;
    const userIdInt = parseInt(userId, 10); // Convert id to integer

    if (userIdInt) {
      const user = await db.users.findOne({
        where: {
          id: userIdInt,
        }
      });

      res.status(200).send({
        isActive: user.isActive
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}
