const express = require("express");
const router = express.Router();
const Movie = require("./model");
const checkJwt = require("../../utils/jwt");
const catchAsync = require("../../utils/catchAsync");
const { moviePostValidate, movieDeleteValidate, keywordValidate,
    moviePutValidate, moviePatchValidate } = require("../../middleware/validator");

router.route("/")
.get(async (req, res, next) => {
    const movies = await Movie.find(req.query).exec();
    res.status(200).json({ movies });
})
.post(checkJwt, moviePostValidate, catchAsync(async (req, res, next) => {
    const newMovie = new Movie(req.body);
    newMovie.save();
    res.status(200).json({ msg: "Success!" });
}))
.delete(checkJwt, movieDeleteValidate, async (req, res, next) => {
    const { id } = req.query;
    await Movie.deleteOne({ _id: id });
    res.status(200).json({ msg: "Success!" });
})
.put(checkJwt, moviePutValidate, catchAsync(async (req, res, next) => {
    const { id } = req.query;
    await Movie.findOneAndUpdate(
        { _id: id },
        req.body,
        { overwrite: true }
    );
    res.status(200).json({ msg: "Success!" });
}))
.patch(checkJwt, moviePatchValidate, catchAsync(async (req, res, next) => {
    const { id } = req.query;
    await Movie.findOneAndUpdate(
        { _id: id },
        { $set: req.body }
    );
    res.status(200).json({ msg: "Success!" });
}));

// Get a random movie from the collection
router.route("/random")
.get(async (req, res, next) => {
    const count = await Movie.countDocuments().exec();
    const random = Math.floor(Math.random() * count);
    const randomMovie = await Movie.findOne().skip(random).exec();
    res.status(200).json(randomMovie);
});

// Keyword search
// db.movies.createIndex({title: "text"});
router.route("/keyword")
.get(keywordValidate, async (req, res, next) => {
    const { q } = req.query;
    const movie = await Movie.find({$text: {$search: q}}).exec();
    res.status(200).json(movie);
});

module.exports = router;
