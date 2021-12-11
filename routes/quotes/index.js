const express = require("express");
const router = express.Router();
const Quote = require("./model");
const Movie = require("../movies/model");

const checkMovieId = async id => {
    // Check if movie id exists
    if (id) return await Movie.exists({ _id: id });
    return true;
} 

router.route("/")
.get(async (req, res, next) => {
    try {
        let quotes = await Quote.find(req.query).lean().exec();
        quotes = await Promise.all(quotes.map(async quote => {
            const movie = await Movie.findOne({ _id: quote.movie }).exec();
            quote.movie = movie.title;
            return quote;
        }));
        res.status(200).json({ quotes });
    } catch(err) {
        next(err);
    }
})
.post(async (req, res, next) => {
    try {
        const { movie } = req.body;
        if (!await checkMovieId(movie)) return res.status(404).json({ msg: "Invalid movie id." });
        // Save the new Quote
        const newQuote = new Quote({...req.body});
        let errors = newQuote.validateSync();
        if (errors) return res.status(404).json({ msg: "Invalid data." });
        newQuote.save();
        res.status(200).json({ msg: "Success!" });
    } catch(err) {
        next(err);
    }
})
.delete(async (req, res, next) => {
    const { id } = req.query;
    if (!id) return res.status(404).json({msg: "Invalid query parameter."});
    const result = await Quote.deleteOne({ _id: id });
    if (!result.deletedCount) return res.status(404).json({ msg: "Invalid id." });
    res.status(200).json({ msg: "Success!" });
})
.put(async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(404).json({msg: "Invalid query parameter."});
        const { quote, character, movie } = req.body;
        if (!quote || !character || !movie) return res.status(404).json({msg: "Invalid data."});
        if (!await checkMovieId(movie)) return res.status(404).json({ msg: "Invalid movie id." });
        const result = await Quote.findOneAndUpdate(
            { _id: req.query.id },
            { quote, character, movie },
            { overwrite: true }
        );
        if (!result) return res.status(404).json({ msg: "Invalid id." });
        res.status(200).json({ msg: "Success!" });
    } catch(err) {
        // next(err);
        res.status(404).json({ msg: "Invalid data." });
    }
})
.patch(async (req, res, next) => {
    try {
        const { id } = req.query;
        const { movie } = req.body;
        if (!id) return res.status(404).json({msg: "Invalid query parameter."});
        if (!await checkMovieId(movie)) return res.status(404).json({ msg: "Invalid movie id." });
        const result = await Quote.findOneAndUpdate(
            { _id: req.query.id },
            { $set: req.body }
        );
        if (!result) return res.status(404).json({ msg: "Invalid id." });
        res.status(200).json({ msg: "Success!" });
    } catch(err) {
        // next(err);
        res.status(404).json({ msg: "Invalid data." });
    }
});

// Get a random quote from the collection
router.route("/random")
.get(async (req, res, next) => {
    try {
        const count = await Quote.countDocuments(req.query).exec();
        const random = Math.floor(Math.random() * count);
        let randomQuote = await Quote.findOne(req.query).skip(random).lean().exec();
        // Find the movie title
        const movie = await Movie.findOne({ _id: randomQuote.movie }).exec();
        randomQuote.movie = movie.title;
        res.status(200).json(randomQuote);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
