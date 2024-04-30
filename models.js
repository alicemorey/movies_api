const mongoose = require('mongoose');
const bcrypt=require ('bcrypt');

// Define movieSchema format to be used in MongoDB
let movieSchema = mongoose.Schema({
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
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Birthday: {type:Date, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//convert user password into hashed format using bcrypt.js
userSchema.statics.hashPassword=(password)=>{
    return bcrypt.hashSync(password, 10);
};

//validates user password by compating it with the stored hashed password
userSchema.methods.validatePassword=function(password){
    return bcrypt.compareSync(password, this.Password);
};

// create models on defined schemas
let User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", movieSchema);

//exports defined modules so they can be used
module.exports = { User, Movie };