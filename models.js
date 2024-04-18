const mongoose= require('mongoose');

let movieSchema=mongoose.Schema({
    Title:{type:String, Required:true},
    Description:{type:String, required:true},
    Genre:{
        Name:String, 
        Description:String,
    },
    Director:{
        Name:String,
        Bio:String,
        Birth:String,
    },
    Actos:[String],
    ImagePath:String,
    Featured:Boolean
    });

    let userSchema =mongoose.Schema({
        Username:{type:String, required:true},
        Password:{type:String, required:true},
        Email:{type:String, required:true},
        Birthday:Date,
        FavoriteMovies:[{type:mongoose.Schema.Types.ObjectId, ref:'Movie'}]
    });

    let movies1=mongoose.model('movies1', movieSchema);
    let users1=mongoose.model ('users1', userSchema);

    module.exports.movies1=movies1;
    module.exports.users1=users1;
