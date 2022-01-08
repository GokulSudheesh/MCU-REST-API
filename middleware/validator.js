const { body, query, validationResult } = require("express-validator");
const ExpressError = require("../utils/ExpressError");
const Movie = require("../routes/movies/model");
const Quote = require("../routes/quotes/model");

const checkMovieId = async value => {
    const movie = await Movie.exists({ _id: value });
    if (!movie) {
      throw new Error("There is no movie with that id");
    }
}

const checkQuoteId = async value => {
    const quote = await Quote.exists({ _id: value });
    if (!quote) {
      throw new Error("There is no quote with that id");
    }
}

const moviePostRules = [
    // Check movie title
    body("title").isString().withMessage("Title must be a string")
    .trim().notEmpty().withMessage("Missing title"),
    // Check phase
    body("phase").notEmpty().withMessage("Missing phase")
    .isInt().withMessage("Phase must be an integer"),
    // Check release date
    body("release").notEmpty().withMessage("Missing release date")
    .isISO8601().withMessage("Date format should be YYYY-MM-DD"),
    // Check imdb rating
    body("imdb").optional()
    .notEmpty().withMessage("Missing imdb rating")
    .isFloat().withMessage("Imdb rating must be a float")
];

const movieIdExists = [
    // Check the id
    query("id").notEmpty().withMessage("Provide id as the query parameter")
    .isMongoId().withMessage("Provide a valid mongoDB id").bail()
    // Check if that movie exists
    .custom(checkMovieId)
];

const moviePatchRules = [
    // Check movie title
    body("title").optional()
    .isString().withMessage("Title must be a string")
    .trim().notEmpty().withMessage("Missing title"),
    // Check phase
    body("phase").optional()
    .notEmpty().withMessage("Missing phase")
    .isInt().withMessage("Phase must be an integer"),
    // Check release date
    body("release").optional()
    .notEmpty().withMessage("Missing release date")
    .isISO8601().withMessage("Date format should be YYYY-MM-DD"),
    // Check imdb rating
    body("imdb").optional()
    .notEmpty().withMessage("Missing imdb rating")
    .isFloat().withMessage("Imdb rating must be a float")
];

const quotePostRules = [
    // Check quote
    body("quote").isString().withMessage("Quote must be a string")
    .trim().notEmpty().withMessage("Missing quote"),
    // Check character
    body("character").isString().withMessage("Character must be a string")
    .trim().notEmpty().withMessage("Missing character"),
    // Check the movie id
    body("movie").notEmpty().withMessage("Provide movie's id as the query parameter")
    .isMongoId().withMessage("Provide a valid mongoDB id").bail()
    // Check if that movie exists
    .custom(checkMovieId)
];

const quoteIdExists = [
    // Check the id
    query("id").notEmpty().withMessage("Provide id as the query parameter")
    .isMongoId().withMessage("Provide a valid mongoDB id").bail()
    // Check if that movie exists
    .custom(checkQuoteId)
];

const quotePatchRules = [
    // Check quote
    body("quote").optional()
    .isString().withMessage("Quote must be a string")
    .trim().notEmpty().withMessage("Missing quote"),
    // Check character
    body("character").optional()
    .isString().withMessage("Character must be a string")
    .trim().notEmpty().withMessage("Missing character"),
    // Check the movie id
    body("movie").optional()
    .notEmpty().withMessage("Provide movie's id as the query parameter")
    .isMongoId().withMessage("Provide a valid mongoDB id").bail()
    // Check if that movie exists
    .custom(checkMovieId)
];

const keywordSearchRules = [
    // Check query string
    query("q").notEmpty().withMessage("Missing query."),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next()
    const msg = errors.errors.map(err => err.msg).join(", ");
    throw new ExpressError(msg, 400);
}

module.exports = {
    moviePostValidate: [...moviePostRules, validate],
    movieDeleteValidate: [...movieIdExists, validate],
    moviePutValidate: [...movieIdExists, ...moviePostRules, validate],
    moviePatchValidate: [...movieIdExists, ...moviePatchRules, validate],
    quotePostValidate: [...quotePostRules, validate],
    quoteDeleteValidate: [...quoteIdExists, validate],
    quotePutValidate: [...quoteIdExists, ...quotePostRules, validate],
    quotePatchValidate: [...quoteIdExists, ...quotePatchRules, validate],
    keywordValidate: [...keywordSearchRules, validate]
};
