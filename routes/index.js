const express = require("express");
const router = express.Router();
const movies = require("./movies");
const quotes = require("./quotes");

router.use("/movies", movies);
router.use("/quotes", quotes);

// router.get('/', (req, res) => {
//     res.status(200).json({ message: 'Connected!' });
// });

module.exports = router;
