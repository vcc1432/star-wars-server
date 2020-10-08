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
  let query = req.query.q;
  let response; 

  try {
    response = await axios.get(`https://swapi.dev/api/films/?search=${query}`);
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later', 
      500
    );
    return next(error);
  }

  const data = response.data;
  if (!data.results || data.results.length === 0) {
    const error = new HttpError(
      'Could not find a film for the provided query.', 
      404
    );
    return next(error);
  }

  const films = data.results;
  const pArray = films.map(async film => {
    let fetchedCharacters = await getCharacterData(film.characters);
    console.log(fetchedCharacters)
    return {
      title: film.title, 
      episode_id: film.episode_id, 
      characters: fetchedCharacters 
    };
  });
  const newFilms = await Promise.all(pArray);
  console.log(newFilms);

  res.json(newFilms);
});

async function getCharacterData (characters) {
  let fetchedCharacters = [];
  for (let characterUrl of characters) {
    try {
      response = await axios.get(characterUrl);
    } catch (err) {
      const error = new HttpError(
        'Fetching character failed, please try again later', 
        500
      );
      return next(error);
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

app.listen(3000, () => {
  console.log('Server started!');
})