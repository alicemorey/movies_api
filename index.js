/**
 * root file of the myFlix back end application
 * importing packages required for the project
 * @requires express
 * @requires bodyParser
 * @requires fs
 * @requires path
 * @requires uuid
 * @requires morgan
 * @requires CORS
 * @requires ./auth
 * @requires ./passport
 * @requires mongoose
 * @requires ./models.js
 * @requires express-validator
 */
const express = require("express"),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  path = require("path"),
  uuid = require("uuid"),
  morgan = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { check, validationResult } = require("express-validator");

const cors = require("cors");
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

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// connection to middleware
accessLogStream = fs.createWriteStream(path.join(__dirname, "./log.txt.log"), {
  flags: "a",
});

// keeping below code for local connetion use
mongoose.connect("mongodb://localhost:27017/myflix", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * connection to online database hosted by mongoDB
 */
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(express.static("public"));

// creates a txt log file, recording any requests made to the API
app.use(
  morgan("common", {
    stream: fs.createWriteStream("./log.txt.log", { flags: "a" }),
  })
);
app.use(morgan("dev"));

/**
 * Welcome page text response
 * @function
 * @method GET - endpoint '/'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with the welcome message
 */
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix Movie App!");
});

/**
 * Retrieves a list of all movies
 * @function
 * @method GET - endpoint '/movies'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with the list of movies
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Retrieves a specific movie by its' title
 * @function
 * @method GET - endpoint '/movies/:Title'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with the info of one movie
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Retrieves a specific Genre by its' title
 * @function
 * @method GET - endpoint '/movies/genre/:Name'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with info of one genre
 */
app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movies) => {
        res.send(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Retrieves a specific Director by their Name
 * @function
 * @method GET - endpoint '/movies/director/:directorName'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with info of one director
 */
app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movies) => {
        res.send(movies.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Adds a new movie to the database by filling out required information
 * @function
 * @method POST - endpoint '/movies'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding data about a movie
 */
app.post(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ Title: req.body.Title });
      if (movie) {
        return res.status(400).send(req.body.Title + "already exists");
      } else {
        const newMovie = await Movies.create({
          Title: req.body.Title,
          Description: req.body.Description,
          Genre: {
            Name: req.body.Genre.Name,
            Description: req.body.Genre.Description,
          },
          Director: {
            Name: req.body.Director.Name,
            Bio: req.body.Director.Bio,
            Birthyear: req.body.Director.Birthyear,
            Deathyear: req.body.Director.Deathyear,
          },
          ImagePath: req.body.ImagePath,
          Featured: req.body.Featured,
          Release: req.body.Release,
        });
        res.status(201).json(newMovie);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error" + error);
    }
  }
);

/**
 * Retreives all registered users
 * @function
 * @method GET - endpoint '/users'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - HTTP response object with a list of users
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Retrieves a specific user by their Name
 * @function
 * @method GET - endpoint '/users/:Username'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding data of the user
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Allows users to register by filling out required information
 * @function
 * @method POST - endpoint '/users'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding data of the new user
 */
app.post(
  "/users",
  [
    check(
      "Username",
      "Username is required and minimum length is 5 characters"
    ).isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
    // check('Birthday', 'Birthday should be in the format DD/MM/YYYY').isDate({format:'DD/MM/YYYY'})
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            // req.body is data input by user, the keys (eg Email) correlate to a field in models.js
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Allows existing user to update their information
 * @function
 * @method PATCH - endpoint '/users/:Username'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding updated data of the user
 */
app.patch(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let updateObj = {};
    if (req.body.Username !== undefined) updateObj.Username = req.body.Username;
    if (req.body.Password !== undefined)
      updateObj.Password = Users.hashPassword(req.body.Password);
    if (req.body.Email !== undefined) updateObj.Email = req.body.Email;
    if (req.body.Birthday !== undefined) updateObj.Birthday = req.body.Birthday;

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $set: updateObj },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allows registered users to add a movie to their favorites
 * @function
 * @method POST - endpoint '/users/:Username/movies/:MovieID'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding updated data of the user
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allows registered users to remove a movie from their favorites
 * @function
 * @method DELETE - endpoint '/users/:Username/movies/:MovieID'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {object} - JSON object holding updated data of the user
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allows a registered user to delete their account
 * @function
 * @method DELETE - endpoint '/users/:Username'
 * @param {object} - HTTP request object
 * @param {object} - HTTP response object
 * @returns {string} - message confirming account deletion
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// error handler middleware function, place after all route calls
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("It's not working right now!");
});

// starts server on specified port and listens for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
