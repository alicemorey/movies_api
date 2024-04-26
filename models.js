const mongoose = require('mongoose');
const bcrypt=require ('bcrypt');

// Define movieSchema format to be used in MongoDB
let movies1Schema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: { 
        Name:String,
        Description:String
    }, 
    Director: {
        Name:String,
        Bio:String, 
        Birthyear: Date
    },
    ImagePath: String,
    Featured: Boolean
});

// Define schema for User
let users1Schema = mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Birthday: {type:Date, required: true},
    FavoriteMovie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//convert user password into hashed format using bcrypt.js
users1Schema.statics.hashPassword=(password)=>{
    return bcrypt.hashSync(password, 10);
};

//validates user password by compating it with the stored hashed password
users1Schema.methods.validatePassword=function(password){
    return bcrypt.compareSync(password, this.Password);
};

// create models on defined schemas
const users1 = mongoose.model('User', users1Schema);
const movies1 = mongoose.model('Movie', movies1Schema);

module.exports = { users1, movies1 };