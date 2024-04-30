const passport =require('passport'),
    LocalStrategy=require ('passport-local').Strategy,
    Models = require('./models'),
    passportJWT=require("passport-jwt");

let Users=Models.User,
    ExtractJWT=passportJWT.ExtractJwt,
    JWTStrategy = passportJWT.Strategy;

//Passport Local Strategy for user login
passport.use (
    new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
},
(username, password, callback)=> {
    console.log(username +"" + password); 
    Users.findOne({Username:username})
    .then(user =>{
        if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
                message: 'Incorrect username or password',
            });
        }
        if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, {message:'Incorrect password'});
    }
    console.log ("finished");
    return callback (null, user);
    })
.catch ((error)=> {
    console.log(error);
    return callback(error);
});
}));

passport.use(
    new JWTStrategy(
    {
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'your_jwt_secret'
},
(jwtPayload, callback)=>{
    return Users.findByID (jwtPayload._id)
    .then(user =>{
        return callback (null, user);
    })
    .catch(err=>{
        return callback(err);
    });
}
));

