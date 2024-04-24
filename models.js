const mongoose = require('mongoose');

// Define schema for User
const users1Schema = new mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    FavoriteMovie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies1' }]
});

// Define schema for Director
const DirectorSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Bio: String,
    Birth: String
});

// Define schema for Genre
const GenreSchema = new mongoose.Schema({
    Name: { type: String, required: true }
});

// Define schema for Favorite Movie
const favoriteMovieSchema = new mongoose.Schema({
    Title: { type: String, required: true },
});

// Define schema for Movie
const movies1Schema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    Director: DirectorSchema,
    ImagePath: String,
    Featured: Boolean
});

// Define models
const User = mongoose.model('users1', users1Schema);
const Director = mongoose.model('Director', DirectorSchema);
const Genre = mongoose.model('Genre', GenreSchema);
const FavoriteMovie = mongoose.model('FavoriteMovie', favoriteMovieSchema);
const Movie = mongoose.model('movies1', movies1Schema);

module.exports = { User, Director, Genre, FavoriteMovie, Movie };