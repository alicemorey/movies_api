const passport= require('passport'),
LocalStrategy=require('passport-local').Strategy,
Models=require('./models.js'),
passportJWT=require('passport-jwt');

let users1=Models.users1,
    JWTStrategy=passportJWT.Strategy,
    ExtractJWT=passportJWT.ExtractJwt;

    passport.use(
        new LocalStrategy(
            {
                usernameField:'Username',
                passwordField:'Password',
            },
            async (username, password, callback)=>{
                console.log(`${username} ${password}`);
                await users1.findOne({Username:username})
                .then ((user)=>{
                    if(!user){
                        console.log('incorrect username');
                        return callback(null, false, {
                            message:'Incorrect username or password.',
                        });
                    }
                    console.log('finished');
                    return callback(null, users1);
                })
                .catch ((error)=>{
                    if (error){
                    console.log(error);
                    return callback(error);
                    }
                })
            }
        )
    );

    passport.use(new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken (),
        secretOrKey: 'your_jwt_server'
    }, async (jwtPayload, callback)=>{
        return await users1.findById(jwtPayload._id)
        .then((user)=>{
            return callback (null, user);
        })
        .catch((error)=>{
            return callback(error)
        });
    }));