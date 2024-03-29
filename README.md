# star-wars-server

This is the server for the Star Wars Fan Page. It implements the Star Wars API at https://swapi.dev/. 
There are two endpoints: /search and /search/:id. 

### /search

When no parameters are added to the URL, the /search endpoint fetches all films. By appending the query parameter q={yourQuery} to the URL, the user can search for a specific film by title.

Example: `http://localhost:5000/search?q=jedi`. 

### /search/:id

/search:id endpoint fetches the movie with the corresponding Id, and return a JSON object with the info about that movie, and all its characters.

Example: `http://localhost:5000/search?q=jedi`.

## Technical decisions

For bigger apps, I would have structured the files in a /routes directory, but since this app is pretty small, only one server.js-file will give a clear overview of the code. 

## Requirements

For development, you will only need Node.js and a node global package, NPM, installed in your environment.

## Install

    $ git clone https://github.com/vcc1432/star-wars-server.git
    $ cd star-wars-server
    $ npm install

## Running the project

    $ node server.js
    
