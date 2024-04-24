const mongoose= require('mongoose');

// define genre schema
const GenreSchema=mongoose.Schema({
    Name: {type:String, required:true},
});

//define director schema
const DirectorSchema=mongoose.Schema({
    Name:{type:String, required:true},
    Bio: String, 
    Birth:String
});
//const director=mongoose.model ('Director', directorSchema)

//define favourite movie schema for user
//const favoritemovieSchema=mongoose.Schema({
    //Name: {type:String, required:true},
//});

//define movie schema
const movies1Schema=mongoose.Schema({
    Title:{type:String, required:true},
    Description:{type:String, required:true},
    Genre:{ type:mongoose.Schema.Types.ObjectId, ref:'Genre', required:true},
    Director:{type:mongoose.Schema.Types.ObjectId, ref:'Director', required:true},
    Actor:[String],
    ImagePath:String,
    Featured:Boolean
    });

//define user schema
const users1Schema =mongoose.Schema({
    Username:{type:String, required:true},
    Email:{type:String, required:true},
    Password:{type:String, required:true},
    FavoriteMovie:[{type:mongoose.Schema.Types.ObjectId, ref:'movies1'}]
    });

//create models
const movies1=mongoose.model('movies1', movies1Schema);
const users1=mongoose.model ('users1', users1Schema);
const Director=mongoose.model ('Director', DirectorSchema);
const Genre=mongoose.model ('Genre', GenreSchema);
//const FavoriteMovie=mongoose.model ('FavoriteMovie', favoritemovieSchema);

module.exports= {movies1,users1,Director, Genre};
    
