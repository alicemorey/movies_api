const passport =require('passport');
const LocalStrategy=require ('passport-local').Strategy;
const passportJWT=require("passport-jwt");
const ExtractJWT=passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
Models = require('./models')

passport.use (new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
},
function (username, password, cb) {
    return UserModel.findOne({username, password})
    .then(user =>{
        if (!user) {
            return cb(null, false, {message: 'Incorrect username or password'});
        }
        return cb(null, false, {message:'Logged in successfully'});
    })
.catch (err=>cb(err));
}
));

passport.use(new JWTStrategy({
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'your_jwt_secret'
},
function (jwtPayload, cb){
    return UserModel.findOneByID (jwtPayload.id)
    .then(user =>{
        return cb (null, user);
    })
    .catch(err=>{
        return cb(err);
    });
}
));

