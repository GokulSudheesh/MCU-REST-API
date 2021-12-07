const express = require("express");
const router = express.Router();
const Movie = require("./model");

router.route("/")
.get(async (req, res, next) => {
    try {
        const { id } = req.query;
        const filter = id ? { _id: id } : {};
        const movies = await Movie.find(filter).exec();
        res.status(200).json({ movies });
    } catch(err) {
        next(err);
    }
})
.post(async (req, res, next) => {
    try {
        // let { release } = req.body;
        // release = new Date(release).toISOString();
        // Save the new movie
        const newMovie = new Movie({...req.body});
        let errors = newMovie.validateSync();
        if (errors) return res.status(404).json({ msg: "Invalid data." });
        newMovie.save();
        res.status(200).json({ msg: "Success!" });
    } catch(err) {
        next(err);
    }
})
.delete(async (req, res, next) => {
    const { id } = req.query;
    if (!id) return res.status(404).json({msg: "Invalid query parameter."});
    const result = await Movie.deleteOne({ _id: id });
    if (!result.deletedCount) return res.status(404).json({ msg: "Invalid id." });
    res.status(200).json({ msg: "Success!" });
})
.put(async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(404).json({msg: "Invalid query parameter."});
        const { title, phase, release, imdb } = req.body;
        if (!title || !phase || !release || !imdb) return res.status(404).json({msg: "Invalid data."});
        const result = await Movie.findOneAndUpdate(
            { _id: req.query.id },
            { title, phase, release, imdb },
            { overwrite: true }
        );
        if (!result) return res.status(404).json({ msg: "Invalid id." });
        res.status(200).json({ msg: "Success!" });
        // Movie.findOneAndUpdate(
        //     { _id: req.query.id },
        //     { title, phase, release, imdb },
        //     { overwrite: true },
        //     function(err, result){
        //         console.log(result);
        //         if (err) {
        //             console.log(err);
        //             res.status(404).json({ msg: "Error." });
        //         } else if (!result) {
        //             res.status(404).json({ msg: "Invalid id." });
        //         } else {
        //             res.status(200).json({ msg: "Success!" });
        //         }
        //     }
        // );
    } catch(err) {
        // next(err);
        res.status(404).json({ msg: "Invalid data." });
    }
})
.patch(async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(404).json({msg: "Invalid query parameter."});
        const result = await Movie.findOneAndUpdate(
            { _id: req.query.id },
            { $set: req.body }
        );
        if (!result) return res.status(404).json({ msg: "Invalid id." });
        res.status(200).json({ msg: "Success!" });
        // Movie.findOneAndUpdate(
        //     { _id: req.query.id },
        //     { $set: req.body },
        //     function(err, result){
        //         console.log(result);
        //         if (err) {
        //             console.log(err);
        //             res.status(404).json({ msg: "Error." });
        //         } else if (!result) {
        //             res.status(404).json({ msg: "Invalid id." });
        //         } else {
        //             res.status(200).json({ msg: "Success!" });
        //         }
        //     }
        // );
    } catch(err) {
        // next(err);
        res.status(404).json({ msg: "Invalid data." });
    }
});

// Get a random movie from the collection
router.route("/random")
.get(async (req, res, next) => {
    try {
        const count = await Movie.countDocuments().exec();
        const random = Math.floor(Math.random() * count);
        const randomMovie = await Movie.findOne().skip(random).exec();
        res.status(200).json(randomMovie);
    } catch(err) {
        next(err);
    }
});

// Keyword search
// db.movies.createIndex({title: "text"});
router.route("/keyword")
.get(async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(404).json({msg: "Invalid query parameter."});
        const movie = await Movie.find({$text: {$search: q}}).exec();
        res.status(200).json(movie);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
