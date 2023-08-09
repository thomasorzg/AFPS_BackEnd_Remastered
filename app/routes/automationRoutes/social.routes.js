module.exports = (app) => {
  const jwt = require("../../helpers/jwt");
  const db = require("../../models");
  const Op = db.Sequelize.Op;
  const Users = db["users"];

  var router = require("express").Router();

  var passport = require("passport");
  var GoogleStrategy = require("passport-google-oidc");

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const HOST_URL = process.env.HOST_URL;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${HOST_URL}oauth2/redirect/google`,
      },
      function (issuer, profile, cb) {
        // console.log(issuer);
        // console.log(profile);
        // console.log(cb);
        // console.log(profile.emails);
        return cb(null, profile);
      }
    )
  );

  router.get(
    "/oauth2/redirect/google",
    passport.authenticate("google", {
      failureRedirect: "/login",
      failureMessage: true,
      session: false,
    }),
    async function (req, res) {
      console.log(req.user.emails[0].value);

      var condition = {
        where: {
          [Op.and]: [
            {
              email: req.user.emails[0].value,
            },
          ],
        },
      };

      const data = await Users.findOne(condition);

      if (data) {
        var result = {
          access_token: jwt.accessTokenEncode(data.id),
          refresh_token: jwt.refreshTokenEncode(data.id),
          user: data,
        };
      } else {
        const users = new Users({
          email: req.user.emails[0].value,
          name: req.user.displayName,
        });
        const data_ = await users.save(users);

        var result = {
          access_token: jwt.accessTokenEncode(data_.id),
          refresh_token: jwt.refreshTokenEncode(data_.id),
          user: data_,
        };
      }

      var responseHTML =
        '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
      responseHTML = responseHTML.replace("%value%", JSON.stringify(result));
      res.status(200).send(responseHTML);
    }
  );

  router.get(
    "/login/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.use("/", router);
};