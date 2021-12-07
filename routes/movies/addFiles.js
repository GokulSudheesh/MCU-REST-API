require("../../config/database");
const fs = require("fs");
const Movie = require("./model");
const { movies } = JSON.parse(fs.readFileSync(__dirname + '/files.json', 'utf8'));

Movie.insertMany(
    movies,
    err => {
        if (err){
            console.error(err);
        } else {
            console.log("Successfully inserted docs.");
        }
    }
);
