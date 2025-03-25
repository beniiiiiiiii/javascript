const express = require('express')

const app = express();
const PORT = 4000

const MOVIES = {
    "movie1": {
        "title": "Movie 1",
        "year": 1994,
        "director" : "john",
        "hasOscar" : true
    },
    "movie2": {
        "title": "Movie 2",
        "year": 2010,
        "director" : "jane",
        "hasOscar" : false
    },
    "movie3": {
        "title": "Movie 3",
        "year": 1983,
        "director" : "james",
        "hasOscar" : true
    },
    "movie4": {
        "title": "Movie 4",
        "year": 2001,
        "director" : "russel",
        "hasOscar" : false
    }
}

app.get("/movies", (req, res) => {
    res.json(MOVIES);
})

app.get("/movies/:id", (req, res) =>{
    var id = req.params.id;
    if (id>MOVIES.lenght) {
        res.status(404).json({"error": "Movie not found"});
    }
    else {
        res.json(MOVIES[id]);
    }
})

app.post("/movies", (req, res)=>{
    const movie = 
})









app.listen(3000, ()=> "Server runs on port 3000")
