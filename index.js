const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const app = express();
const movies1 = Models.Movie;
const users1 = Models.User;
const Genre = Models.Genre;
const Director = Models.Director;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myflix', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.use(bodyParser.json());
app.use(morgan("common"));

// Routes

// Welcome message
app.get("/", (req, res) => {
    res.send("Welcome to my movie app - MyFlix!");
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await users1.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// GET a user by username
app.get('/users/:Username', async (req, res) => {
    try {
        const user = await users1.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// POST - add a user
app.post('/users', async (req, res) => {
    try {
        const existingUser = await users1.findOne({ Username: req.body.Username });
        if (existingUser) {
            return res.status(400).send(req.body.Username + ' already exists');
        }
        const newUser = await users1.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// UPDATE user info by username
app.put('/users/:Username', async (req, res) => {
    try {
        const updatedUser = await users1.findOneAndUpdate(
            { Username: req.params.Username },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// DELETE a user by username
app.delete('/users/:Username', async (req, res) => {
    try {
        const deletedUser = await users1.findOneAndDelete({ Username: req.params.Username });
        if (!deletedUser) {
            return res.status(404).send(req.params.Username + ' was not found');
        }
        res.status(200).send(req.params.Username + ' was deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// GET movies - return JSON with populated Genre and Director
app.get('/movies', async (req, res) => {
    try {
        const movies = await movies1.find().populate('Genre').populate('Director');
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// GET Movie info from title - return JSON
app.get('/movies/:Title', async (req, res) => {
    try {
        const movie = await movies1.findOne({ Title: req.params.Title }).populate('Genre').populate('Director');
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        res.json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// POST - Add a movie to a user's favorites
app.post('/users/:Username/favorites', async (req, res) => {
    try {
        const updatedUser = await users1.findOneAndUpdate(
            { Username: req.params.Username },
            { $addToSet: { FavoriteMovie: req.body.ObjectId } },
            { new: true }
        ).populate('FavoriteMovie');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// GET Genre
app.get('/genre/:Name', async (req, res) => {
    try {
        const genre = await Genre.findOne({ Name: req.params.Name });
        if (!genre) {
            return res.status(404).send("Genre not found");
        }
        res.json(genre);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// GET info on director
app.get('/director/:Name', async (req, res) => {
    try {
        const director = await Director.findOne({ Name: req.params.Name });
        if (!director) {
            return res.status(404).send("Director not found");
        }
        res.json(director);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Static files from the public folder
app.use(express.static('public'));

// Middleware to log requests
app.use(morgan('dev'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  