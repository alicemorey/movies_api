const jwtSecret = 'your_jwt_secret';
const express =require('express');
const router =express.Router();
const jwt= require ('jsonwebtoken');
const passport= require ("passport");
require('./passport');

// POST login
router.post ('/login', function (req, res, next){
    passport.authenticate ('local', {session:false}, (err, users1)=>{
        if (err|| !user){
            return res.status(400).json({
                message:'Something is not right',
                user: user
            });
        }
    req.login(user, {session:false}, (err)=>{
        if (err){
            res.send(err);
        }
        // generate a signed son web token with the contents of user object & return it in the response
    const token=jwt.sign (user.toJSON(), 'your_jwt_secret');
    return res.json ({user, token});
    });
    })(req, res);
})