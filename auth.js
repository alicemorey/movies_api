// This has to be the same key used in the JWTStrategy
const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

// my local passport file
require("./passport");

/**
 * Allows a JWT token to be generated from user data
 * @param {object} user in which JWT should be generated for
 * @returns {string} - generated JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // this is the username encoded in in the JWT
    expiresIn: "7d", // specifies that the token will expire in 7 days
    algorithm: "HS256", // algorithm used to “sign” or encode the values of the JWT
  });
};

/**
 * /login endpoint for exisiting users implemented by POST method
 * authentication provided by passport
 * JWT token is implemented upon successful authentication
 * @param {object} router - provided by Express router
 * @returns {object} - JOSN object holding user data and token
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        console.log("emma says", error);
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
