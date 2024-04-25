const express =require('express');
const router =express.Router();
const jwt= require ('jsonwebtoken');
const passport= require ("passport");

// POST login
router.post ('/login', function (req, res, next){
    passport.authenticate ('local', {session:false}, (err, users1)=>{
        if (err|| !users1){
            return res.status(400).json({
                message:'Something is not right',
                user: users1
            });
        }
    req.login(user, {session:false}, (err)=>{
        if (err){
            res.send(err);
        }
        // generate a signed son web token with the contents of user object & return it in the response
    const token=jwt.sign (users1.toJSON(), 'your_jwt_secret');
    return res.json ({users1, token});
    });
    })(req, res);
})