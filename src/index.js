const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { query } = require('express');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// STATIC  REACT
const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));

//STATIC IMAGES
const staticServerPathWeb2 = './src/public-movies-images';
server.use(express.static(staticServerPathWeb2));

//STATIC sass
const staticServerPathWeb3 = './src/stylesheets';
server.use(express.static(staticServerPathWeb3));

// VIEW EJS

server.set('view engine', 'ejs');

// database
const db = new Database('./src/db/database.db', { verbose: console.log });

// endpoint fetch allmovies

server.get('/users/movies', (req, res) => {
  //console.log(req.query.gender);
  //console.log(req.query.sort);
  //1-declarar mi query
  const query = db.prepare('SELECT *  FROM movies');
  //2-ejecutar la query
  const movies = query.all();
  const response = {
    success: true,
    movies,
  };
  console.log(response);
  res.json(response);
});
// const response = {
//   success: true,
//   movies,
// };
//const filterData = response.movies.filter((movieApi) => movieApi.gender === req.query.gender)
//res.json(response);

server.post('/login', (req, res) => {
  console.log(req.body.userEmail);
  console.log(req.body.userPass);
  const query = db.prepare('SELECT email = ?, password = ? FROM users');
  const userAll = query.get(req.body.userEmail, req.body.userPass);
  const response = {
    success: true,
    user: userAll,
  };
  console.log(userAll);
  res.json(response);
});

server.get('/movie/:movieId', (req, res) => {
  //console.log(('Url params movieId', req.params.movieId));
  const foundMovie = movies.find((movie) => {
    return movie.id === parseInt(req.params.movieId);
  });

  console.log(foundMovie);
  //res.json(foundMovie)

  res.render('movie', foundMovie);
});

server.post('/signup', (req, res) => {});
