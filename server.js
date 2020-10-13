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
  res.json(data);
});

app.get('/search/:id', async (req, res, next) => {
  const id = req.params.id;
  let response; 

  try {
    response = await axios.get(`https://swapi.dev/api/films/${id}`);
  } catch (err) {
    const error = new HttpError(
      'Fetching movie failed, please try again later', 
      500
    );
    return next(error);
  }

  const data = response.data;

  // character array contains swapi urls, so first fetch character data
  let fetchedCharacters = await getCharacterData(data.characters);
    
  // now sort characters by height asc
  fetchedCharacters.sort((a, b) => {
    return parseFloat(a.height) - parseFloat(b.height);
  });
  
  const newData = { ... data, characters: fetchedCharacters  };
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