require("../../config/database");
const fs = require("fs");
const Quote = require("./model");
const Movie = require("../movies/model");
let { quotes } = JSON.parse(fs.readFileSync(__dirname + '/files.json', 'utf8'));

(async () => {
    quotes = await Promise.all(quotes.map(async quote => {
        const movie = await Movie.findOne({ title: quote.movie }).exec();
        console.log(quote.movie);
        quote.movie = movie._id;
        return quote;
    }));
    // console.log(quotes);
    Quote.insertMany(
        quotes,
        err => {
            if (err){
                console.error(err);
            } else {
                console.log("Successfully inserted docs.");
            }
        }
    );
})()

// Quote.insertMany(
//     quotes,
//     err => {
//         if (err){
//             console.error(err);
//         } else {
//             console.log("Successfully inserted docs.");
//         }
//     }
// );
