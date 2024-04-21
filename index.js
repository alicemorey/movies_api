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
const Directors=Models.Director;
const Genres=Models.Genre;

mongoose.connect ('mongodb://localhost:27017/myflix', 
{useNewUrlParser:true, useUnifiedTopology:true});

app.use(bodyParser.json());

//log requests to server
app.use(morgan("common"));

//default text response
app.get("/", (rey, res)=>{
    res.send ("Welcome to my movie app-MyFlix!");
});

//GET movies-return JSON /movies
app.get('/movies',(req, res)=>{
    movies1.find()
    .then((movies1)=>{
        res.status(201).json(movies1);
    })
    .catch ((err)=>{
        console.error(err);
        res.status(500).send("Error:"+ err);
    });
});

// Get all users
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

//GET Movie info from title-return JSON
app.get ('/movies/:Title', (req, res)=>{
    movies1.findOne({Title:req.params.Title})
    .then((movies1)=>{
        res.json(movies1);
    })
    .catch ((err)=>{
        console.error(err);
        res.status(500).send("Error:"+ err);
    });
});

//GET Genre
app.get ('/genre/:Name', (req, res)=>{
    Genres.findOne({Name:req.params.Name})
    .then((genre)=>{
        res.json(genre.Description);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error:"+ err);
    });
});

//GET info on director
app.get('/director/:Name', (req, res)=>{
    Directors.findOne({ Name:req.params.Name})
    .then ((director)=>{
        res.json(director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error:"+err);
    });
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

  