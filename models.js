const mongoose= require('mongoose');

let genreSchema=mongoose.Schema({
    Name: {type:String, required:true},
});
//const genre=mongoose.model ('Genre', genreSchema)

let directorSchema=mongoose.Schema({
    Name:{type:String, required:true},
    Bio: String, 
    Birth:String
});
//const director=mongoose.model ('Director', directorSchema)

let favoritemovieSchema=mongoose.Schema({
    Name: {type:String, required:true},
});

let movieSchema=mongoose.Schema({
    Title:{type:String, Required:true},
    Description:{type:String, required:true},
    Genre:{ type:mongoose.Schema.Types.ObjectId, ref:'Genre', required:true},
    Director:{type:mongoose.Schema.Types.ObjectId, ref:'Director', required:true},
    Actor:[String],
    ImagePath:String,
    Featured:Boolean
    });

    let users1Schema =mongoose.Schema({
        Username:{type:String, required:true},
        Email:{type:String, required:true},
        Password:{type:String, required:true},
        FavoriteMovie:[{type:mongoose.Schema.Types.ObjectId, ref:'FavoriteMovie'}]
    });


    let movies1=mongoose.model('movies1', movieSchema);
    let users1=mongoose.model ('users1', users1Schema);
    let Director=mongoose.model ('Director', directorSchema);
    let Genre=mongoose.model ('Genre', genreSchema);
    let FavoriteMovie=mongoose.model ('FavoriteMovie', favoritemovieSchema);

    module.exports= {movies1,users1,Director, Genre, FavoriteMovie};
    
