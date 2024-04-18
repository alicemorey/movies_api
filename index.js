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

//GET users list
app.get ("/users")
let users = [
    {
      user: "Rob",
      email: "rob@gmail.com",
      password: "*****"
    }, 

    {
    username: "Susan",
    email : "susan@gmail.com",
    password : "*****"
    },

    {
    username: "Ruth",
    email: "ruth@gmail.com",
    password: "*****"
    }
];

// static files from the public folder
app.use(express.static('public'));

// middleware to log requests
app.use(morgan('dev'));


//CREATE new user
app.post ('/users', (req,res)=> {
    const newUser= req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status (201).json(newUser)
    } else {
        res.status(400).send ('users need name')
    }
});

//UPDATE user information
app.put ('/users/:id', (req,res)=> {
    const { id } = req.params;
    const updatedUser= req.body;

    let user =users.find (user => user.id == id);
    if (user) {
        user.name= updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
});

// CREATE User Login
app.post ('/login',(req, res)=> {
    res.send(users);
});

//POST New movie
app.post ('/movies', (req, res)=> {
    const newMovie = req.body;
    movies.push(newMovie);
    res.status(201).json(newMovie);
});


// READ (list of movies)
app.get ('/movies', (req, res)=> {
    const movies = re.body;
    res.status(200).json(movies);
});

//READ list of movie titles
app.get ('/movies/:title',(req, res)=> {
        const { title }= req.params;
        const movie= movies.find( movie=> movie.Title === title);
        if (movie){
            res.status(200).json(movie);
        } else {
            res.status (400).send ('no such movie')
        }
    });

// READ genres
    app.get ('/movies/genre:genreName',(req, res)=> {
        const { genreName }= req.params;
        const moviesByGenre= movies.filter( movie=> movie.Genre=== genreName);
        res.status(200).json(moviesByGenre);

        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(400).send ('no such genre')
        }
    });

//READ directors
app.get ('/movies/directors/:directorName}', (req, res)=> {
    const { directorName } = req.params;
    const director =movies.find (movie => movie.Director.Name === directorName ).Director

    if (director){
        res.status(200).json(director);
    } else {
        res.status(400).send ('no such director')
    }
})

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  