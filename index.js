const express = require ('express');
const app = express();
const morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');

app.use(bodyParser.json());



//users
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

// movies
let movies = [
    { 
        "Title": "The Ring",
        "Year": "2002",
        "Description":"Teenage girls Katie and Becca discuss an urban legend about a cursed videotape that causes whoever watches it to die ins even days. That night, Katie, who watched it a week ago, is killed by an unseen force.",
        "Genre":  "Horror",
        "Director": {
            "Name": "Gore Verbinski",
            "Bio": " The Ring is an American film director, screenwriter, and producer. He is best known for directing Mouse Hunt, The Ring, the first three Pirates of the Caribbean films, and Rango. ",
        },
        "ImageURL":"https://en.wikipedia.org/wiki/The_Ring_%282002_film%29#/media/File:Theringpostere.jpg",
        "Featured":false
    },
    { 
        "Title": "Alien",
         "Year": "1979", 
         "Description": "Alien is a science fiction horror film based on a story by O'Bannon and Ronald Shusett, it follows the crew of the commercial space tug Nostromo, who, after coming across a mysterious derelict spaceship on an uncharted planetoid, find themselves up against a deadly and aggressive extraterrestrial loose within their vessel",
         "Genre": "Horror",
         "Director": {
            "Name":"Ridley Scott",
            "Bio":"was an American film screenwriter, director and visual effects supervisor, usually in the science fiction and horror genres."
         },
         "ImageURL":"https://en.wikipedia.org/wiki/Alien_(film)#/media/File:Alien_movie_poster.jpg",
         "Featured":true

    },
    { 
        "Title": "Suspiria", 
        "Year": "1977",
        "Dessciption":"...",
        "Genre": "Horror",
        "Director": {
            "Name":"Dario Argento",
            "Bio": "..."
        },
        "ImageURL":"...",
        "Featured": false
    },
    {
        "Title": "28 Days Later",
        "Year": "2002",
        "Description":"is a British post-apocalyptic horror film directed by Danny Boyle and written by Alex Garland. It stars Cillian Murphy as a bicycle courier who awakens from a coma to discover the accidental release of a highly contagious, aggression-inducing virus has caused the breakdown of society",
        "Genre":"Horror",
        "Director": {
            "Name":"Danny Boyle",
            "Bio":"is an English director and producer. He is known for his work on films including Shallow Grave, Trainspotting and its sequel T2 Trainspotting, The Beach, 28 Days Later, Sunshine, Slumdog Millionaire, 127 Hours, Steve Jobs, and Yesterday"
        },
        "ImageURL" :"https://en.wikipedia.org/wiki/28_Days_Later#/media/File:28_days_later.jpg",
        "Featured":true
    }
 
    //movies to add later
// { title: 'The Wailing', year: 2016, director: 'Na Hing-jin'},
//{ title: 'Old Boy', year: 2003, director: 'Park Chan-wook'},
//{ title: 'The Conjuring', year: 2013, director: 'James Wan'},
//{ title: 'The Ritual', year: 2017, director: 'David Bruckner'},
//{ title: 'Babadook', year:2014, director:'Jennifer Kent'},
//{ title: 'The Shining', year: 1980, director: 'Stanley Kubrick'}
];


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

  