const express = require ('express');
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const morgan = require('morgan');
const app = express();
const mongoose=require('mongoose');
const Models=require('./models.js');

//app.use(express.json());
//app.use(express.urlencoded({extended:true}));

const movies1=Models.movies1;
const users1=Models.users1;
const Genre=Models.Genre;
const Director=Models.Director;

mongoose.connect ('mongodb://localhost:27017/myflix', 
{useNewUrlParser:true, useUnifiedTopology:true});

app.use(bodyParser.json());

//log requests to server
app.use(morgan("common"));

//default text response
app.get("/", (rey, res)=>{
    res.send ("Welcome to my movie app-MyFlix!");
});

// GET all users
app.get('/users', (req, res) => {
    users1.find()
      .then((users1) => {
        res.status(200).json(users1);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//GET a user by username/ return JSON users
app.get ('/users/:Username', (req, res)=> {
    users1.findOne({Username:redirect.params.Username})
    .then((users1) =>{
        res.json(users1);
    })
    .catch ((err)=> {
        console.error(err);
        res.status(500).send("Error:"+ err);
    })
});

//POST -add a user
app.post('/users', async (req, res) => {
    await users1.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          users1
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//UPDATE user info, by username
app.put('/users/:Username', async (req, res) => {
    await users1.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    })
  
  });

// DELETE a user by username
app.delete('/users/:Username', async (req, res) => {
    try {
      const user = await users1.findOneAndDelete({ Username: req.params.Username });
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  });
  

  //GET movies-return JSON /movies/ with populated Genre and Director
  app.get('/movies', async (req, res) => {
    try {
        const movies = await movies1.find().populate('Genre').populate('Director');
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

//GET Movie info from title-return JSON
app.get ('/movies/:Title', (req, res)=>{
    movies1.findOne({Title:req.params.Title})
        .populate('Genre')
        .populate('Director')
        .then((movie)=>{
        if(!movie) {
            res.status(404).send ("Movie not found");
        }else {
        res.json(movie);
}
})
    .catch ((err)=>{
        console.error(err);
        res.status(500).send("Error:"+ err);
    });
});

// POST Add a movie to a users favorites
app.post('/users/:Username/favorites', async (req, res) => {
    try {
        const updatedUser = await users1.findOneAndUpdate(
            {   Username: req.params.Username}, 
            { $addToSet: { FavoriteMovie: req.body.ObjectId } }, 
                { new: true }
            ).populate ('FavoriteMovie');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

//GET Genre
app.get ('/genre/:Name', async (req, res)=>{
    try{
    const Genre= await Genre.findOne({name:req.params.Name});
        if(!Genre){
            res.status(404).send("Genre not found");
        }
        //res.json({ name:genreData});

    }catch (err){
        console.error(err);
        res.status(500).send("Error:"+ err);
    }
});

//GET info on director
app.get('/director/:Name', async (req, res)=>{
    try{
        const Director=await Director.findOne({ Name:req.params.Name})
        if(!Director){
            res.status(404).send("Director not found");
        }
        res.json({name:Director, bio:Director.Bio, birth:Director.Birth});
} catch(err){
        console.error(err);
        res.status(500).send("Error:"+err);
    }
});

// static files from the public folder
app.use(express.static('public'));

// middleware to log requests
app.use(morgan('dev'));


// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  