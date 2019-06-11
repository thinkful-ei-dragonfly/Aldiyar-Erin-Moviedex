'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');
const cors = require('cors');
const helmet = require('helmet');

console.log(process.env.API_TOKEN);

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearaerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

app.get('/movie', function handleGetMovie(req, res){
  let response = movies;
  const genre = req.query.genre;
  const country = req.query.country;
  const avgVote = Number(req.query.avg_vote);

  // if (req.query && !['genre', 'country', 'avg_vote'].includes(req.query)){
  //   res.status(400).send('Invalid entry');
  // }

  if(genre){
    response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country){
    response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(avgVote){
    response = response.filter(movie => movie.avg_vote >= avgVote);
  }

  console.log('hello');
  res.json({response});
  // res.send(response);
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});