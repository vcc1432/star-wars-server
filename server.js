const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/search', async (req, res, next) => {
  let query = req.query.q;
  let response; 
  try {
    response = await axios.get(`https://swapi.dev/api/films/?search=${query}`);
    console.log('data: ', response.data);
  } catch (err) {
    console.log(`Got error: ${e}`);
  }

  res.json(response.data);
});

app.listen(3000, () => {
  console.log('Server started!');
})