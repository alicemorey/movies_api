const express = require('express');
  bodyParser = require('body-parser');
  fs=require('fs'),
  path=require('path'),
  uuid=require("uuid"), 
  morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const { check, validationResult } = require('express-validator');

//CORS (Cross-Origin Resource Sharing) middleware to handle cross-origin HTTP requests.
const cors=require ('cors');
app.use(cors());

// keeping below code for if/when reverting back to limited origins access
/* let allowedOrigins = ['http://localhost:8080', 'https://movieapi-9rx2.onrender.com/', 'http://localhost:1234', 'http://localhost:56971', 'https://shivg90-myflix-movie-app.netlify.app', 'http://localhost:4200'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
})); */

// Routes
let auth = require('./auth.js')(app);
const passport = require('passport');
require ('./passport.js');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

// connection Middleware
accessLogStream=fs.createWriteStream(path.join(__dirname,'./log.txt.log'),
{flags:'a'});

// connection to local connection with mongoDB
mongoose.connect('mongodb://localhost:27017/myflix', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * connection to online database hosted by mongoDB
 */
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(express.static ('public'));

//creates a txt log file, recording requests made to the Api
app.use(morgan('common', {
  stream:fs.createWriteStream('./log.txt.log',
{flags:'a'})}));

app.use (morgan('dev'));

// Welcome message
app.get("/", (req, res) => {
    res.send("Welcome to my movie app - MyFlix!");
});

// GET movies a list of all movies- endpoint/movies
app.get('/movies', passport.authenticate('jwt', { session: false }), 
 (req, res) => {
   Movies.find()
      .then((movies)=>{
        res.status(200).json(movies);
      })
      .catch ((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
    });
}); 


// GET movie info from title -endpoint/movies:Title
app.get('/movies/:Title', passport.authenticate('jwt',{session:false}),
 (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie)=> {
       res.status(201).json(movie);
    })
    .catch ((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// GET genre by its title endpoint/movies/genre/:Name
app.get('/movies/genre/:Name',passport.authenticate('jwt', { session: false }),
(req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name });
      then((movies) =>{
          res.send(movies.Genre);
      })
      .catch ((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// GET info on director by their name endpoint/director/:Name
app.get('/director/:Name',passport.authenticate('jwt', { session: false }),
 (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName });
      then((movies) =>{
          res.send(movies.Director);
      })
      .catch ((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//POST adds a movie to database
app.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
  const movie = await Movies.findOne({Title: req.body.Title})
  if (movie) {
    return res.status(400).send(req.body.Title + 'already exists');
  } else {
    const newMovie = await Movies.create({
      Title: req.body.Title,
      Description: req.body.Description,
      Genre: {
        Name: req.body.Genre.Name,
        Description: req.body.Genre.Description
      },
      Director: {
        Name: req.body.Director.Name,
        Bio: req.body.Director.Bio,
        Birthyear: req.body.Director.Birthyear,
        Deathyear: req.body.Director.Deathyear
      },
      ImagePath: req.body.ImagePath,
      Featured: req.body.Featured,
      Release: req.body.Release
    })
      res.status(201).json(newMovie)
  }
} catch (error) {
  console.error(error);
  res.status(500).send('Error' + error);
}
});


// GET all users endpoint/users
app.get('/users', passport.authenticate('jwt', { session: false }),
 (req, res) => {
    Users.find()
      .then((users)=>{
        res.status(200).json(users);
    })
     .catch ((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

// GET a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
   Users.findOne({ Username: req.params.Username })
       .then((users)=> {
          res.status(201).json(users);
       })
        .catch ((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//POST allow users to register
app.post ('/users',
[ check('Username', 'Username is required').isLength({min:6}),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Emai does not appear to be valid').isEmail(),
  check('Birthday','Birthday should be in format DD/MM/YYYY').isDate({format:'DD/MM/YYYY'})
], passport.authenticate('jwt', { session: false }),(req, res)=>{
  let errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({ errors:errors.array()});
  }
  let hashedPassword=users.hashPassword(req.body.Password);
  Userssers.findOne({ Username:req.body.Username})
  .then((user)=>{
    if (user){
      return res.status(400).send(req.body.Username +'already exists');
    }else {
      Users.create({
        Username:req.body.Username,
        Email:req.body.Email,
        Password:hashedPassword,
        Birthday:req.body.Birthday
      })
      .then((user)=>{
        res.status(201).json(user)
      })
      .catch((error)=>{
        console.error(error);
        res.status(500).send('Error:'+ error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// UPDATE user info by username/PATCH
app.patch('/users/:Username',passport.authenticate('jwt', { session: false }),
(req, res) => {
  let errors=validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({errors:errors.array()});
  }
  let updateObj={};
    if (req.body.Username !== undefined) updateObj.Username = req.body.Username;
    if (req.body.Password !== undefined) updateObj.Password = Users.hashPassword(req.body.Password);
    if (req.body.Email !== undefined) updateObj.Email = req.body.Email;
    if (req.body.Birthday !== undefined) updateObj.Birthday = req.body.Birthday;

  Users.findOneAndUpdate(
          { Username: req.params.Username },
            { $set: updateObj },
            { new: true },
    (err, updatedUser)=>{
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }else{
      res.json(updatedUser);
    }
});
});

// POST - Add a movie to a user's favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate( 'jwt', { session: false }),
 (req, res) => {
  Users.findOneAndUpdate(
          { Username: req.params.Username },
          { $push: { FavoriteMovie: req.body.MovieID },
},
{new: true},
  (err, updatedUser) => {
  if (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
});
});

//DELETE allow user to remove movie from their favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate( 'jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
     { $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    function(err, updatedUser) {  
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// DELETE allow user to delete account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
 (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username });
      then((user)=> {
        if (!user){
          res.status(400).send(req.params.Username + ' was not found');
        } else{
        res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
    .catch ((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// starts server on specified port and listens for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

  