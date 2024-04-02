const express = require('express');
const morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');
const app = express();

app.use(bodyParser.json());

let users = [
    {
      user: "rob",
      email: "rob@gmail.com",
      password: "*****"
    }, 

    {
    username: "susan",
    email : "susan@gmail.com",
    password : "*****"
    }];



// middleware to log requests
app.use(morgan('dev'));

// static files from the public folder
app.use(express.static('public'));

// top 10 Movies 
app.get('/movies', (req, res)=> {
    const topMovies = [
        { title: 'The Ring', year: 2002, director: 'Gore Verbinski' },
        { title: 'Alien', year: 1979, director: 'Ridley Scott'},
        { title: 'Suspiria', year: 1977, director: 'Dario Argento'},
        { title: '28 Days Later', year: 2002, dirctor: 'Danny Boyle'},
        { title: 'The Wailing', year: 2016, director: 'Na Hing-jin'},
        { title: 'Old Boy', year: 2003, director: 'Park Chan-wook'},
        { title: 'The Conjuring', year: 2013, director: 'James Wan'},
        { title: 'The Ritual', year: 2017, director: 'David Bruckner'},
        { title: 'Babadook', year:2014, director:'Jennifer Kent'},
        { title: 'The Shining', year: 1980, director: 'Stanley Kubrick'}
    ];
    res.json(topMovies);
});

app.get ('/', (req, res)=> {
    res.send ('Welcome to my Top 10 movies!');
});

//list of movies
app.get ('/movies', (res, req)=> {
    res.send(topMovies);
});

//list of movie titles
app.get ('/movies/title',(res,req)=> {
        res.send('Displaying list of movie titles');
    });

// genres
app.get ('/movies/genres/:genreName', (res, req)=> {
    res.send('Displaying movies by genre:{genreName}');
});

//Directors
app.get ('/movies/directors/:direectorName}', (res, req)=> {
    res.send('Displaying movies directed by:{directorName}');
});

// User Login
app.post ('/login',(res, req)=> {
    res.send(users);
});

//Register new user
app.post ('/users', (res,req)=> {
    res.send ('Registering new user');
});

//update user information
app.put ('/users/update', (res, req)=>{
    res.send ('updating user information');
});

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  