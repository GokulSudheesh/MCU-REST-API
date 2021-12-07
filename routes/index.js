const express = require("express");
const router = express.Router();
const movies = require("./movies");

router.use("/movies", movies);

// router.get('/', (req, res) => {
//     res.status(200).json({ message: 'Connected!' });
// });

module.exports = router;
