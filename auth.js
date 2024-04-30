//This to be the same used in the JWTStrategy
const jwtSecret = "your_jwt_secret";

const jwt= require ("jsonwebtoken");
    passport=require ("passport");

//my local passport file
require('./passport');

/** 
 * allows a JWT token to be generated from user data
 * @param {object} user in which JWT should be generated for 
 * @returns {string} -generated JWT token
*/

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
      subject: user.Username, //username encoded in the JWT
      expiresIn: '7d', //specifies the toekn with exprie in 7 days
      algorithm: 'HS256' //algo used to 'sign' or encode values of the JWT
  });
};

/**
 * /POST login endpoint users implemented 
 * authentication provided by passport
 * JWT token is implemented upon successful authentication
 * @param {object} router - provided by Express router
 * @returns {object} - JOSN object holding user data and token
 */
module.exports=(router)=>{
router.post ("/login", (req, res )=>{
    passport.authenticate ("local", {session:false}, (err, user, info)=>{
        if (err|| !user){
            console.log ("alice says", error);
            return res.status(400).json({
                message:'Something is not right',
                user: user
            });
        }
    req.login(user, {session:false}, (err)=>{
        if (error){
            res.send(error);
        }
        // generate a signed son web token with the contents of user object & return it in the response
    let token=generateJWTToken (user.toJSON());
    return res.json ({user, token});
    });
    })(req, res);
});
};