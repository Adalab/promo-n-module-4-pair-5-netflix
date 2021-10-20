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
  const query = db.prepare(
    'SELECT email, password FROM users WHERE email = ? AND password =?'
  );
  const userAll = query.get(req.body.userEmail, req.body.userPass);
  const response = {
    success: true,
    user: userAll,
  };
  console.log(userAll);
  res.json(response);
});

server.get('/movie/:movieId', (req, res) => {
  const urlId = req.params.movieId
  console.log(urlId)
  const query = db.prepare('SELECT *  FROM movies WHERE Id =?');
  //2-ejecutar la query
  const movies = query.get(urlId);
  const response = {
    success: true,
    movies,
  };
  console.log(response);
  //  res.json(response);

  res.render('movie', movies);

});
//const foundMovie = movies.find((movie) => {
//return movie.id === parseInt(req.params.movieId);
//});

//console.log(foundMovie);
//res.json(foundMovie)

//res.render('movie', foundMovie);
//});

//MIRAR PQ SALE ERROR SERVER 500

server.post('/signup', (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  const query = db.prepare('INSERT INTO users (email, password) VALUES(?, ?)');
  const userAll = query.run(req.body.email, req.body.password);
  const response = {
    success: true,
    user: userAll,
  };
  console.log(userAll);
  res.json(response);
});


server.get('/user/movies', (req, res) => {
  const userId = req.header('user-id')
  console.log(userId)

  const query = db.prepare('SELECT * FROM movies, users, rel_movies_users WHERE users.id = rel_movies_users.userId AND movies.id = rel_movies_users.movieId AND users.id = ?');
  const movies = query.run(userId)
  const response = {
    success: true,
    movies: []
  };
  res.json(response)
});

// server.get('/user/movies', (req, res) => {
//   // preparamos la query para obtener los movieIds
//   const movieIdsQuery = db.prepare('SELECT movieId FROM rel_movies_users WHERE userId = ?');
//   // obtenemos el id de la usuaria
//   const userId = req.header('user-id');
//   // ejecutamos la query
//   const movieIds = movieIdsQuery.all(userId); // que nos devuelve algo como [{ movieId: 1 }, { movieId: 2 }];

//   // obtenemos las interrogaciones separadas por comas
//   const moviesIdsQuestions = movieIds.map(id => '?').join(', '); // que nos devuelve '?, ?'
//   // preparamos la segunda query para obtener todos los datos de las películas
//   const moviesQuery = db.prepare(`SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`);

//   // convertimos el array de objetos de ids anterior a un array de números
//   const moviesIdsNumbers = movieIds.map(movie => movie.movieId); // que nos devuelve [1.0, 2.0]
//   // ejecutamos segunda la query
//   const movies = moviesQuery.all(moviesIdsNumbers);

//   // respondemos a la petición con
//   res.json({
//     success: true,
//     movies: movies
//   });
// });