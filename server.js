const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/search', async (req, res, next) => {
  const query = req.query.q;
  const order = req.query.orderBy.toLowerCase();
  let response; 

  try {
    response = await axios.get(`https://swapi.dev/api/films/?search=${query}`);
  } catch (err) {
    const error = new HttpError(
      'Fetching movies failed, please try again later', 
      500
    );
    return next(error);
  }

  const data = response.data;
  const movies = data.results;
  const pArray = movies.map(async movie => {
    // character array contains swapi urls, so first fetch character data
    let fetchedCharacters = await getCharacterData(movie.characters);
    
    // now sort characters by height, asc or desc
    fetchedCharacters.sort((a, b) => {
      if (order === 'desc') {
        return parseFloat(b.height) - parseFloat(a.height);
      } else {
        return parseFloat(a.height) - parseFloat(b.height);
      }
    });

    return {
      ...movie, 
      characters: fetchedCharacters 
    };
  });
  const newMovies = await Promise.all(pArray);
  const newData = { ... data, results: newMovies }

  res.json(newData);
});

const getCharacterData = async (characters) => {
  let fetchedCharacters = [];
  for (let characterUrl of characters) {
    try {
      response = await axios.get(characterUrl);
    } catch (err) {
      const error = new HttpError(
        'Fetching character failed, please try again later', 
        500
      );
      throw error;
    }
    const character = response.data;
    if (!character) {
      const error = new HttpError('Could not find this character', 422);
      throw error;
    }
    fetchedCharacters.push(character)
  }
  return fetchedCharacters;
}  

app.listen(5000, () => {
  console.log('Server started!');
})