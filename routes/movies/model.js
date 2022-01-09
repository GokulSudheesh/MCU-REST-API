const mongoose = require('mongoose');
const { Schema } = mongoose;
const Quote = require("../quotes/model");

const movieSchema = new Schema(
    {
        title: { type: String, required: true },
        phase: { type: Number, required: true },
        release: { type: Date, required: true },
        imdb: { type: Number }
    }
);

// Delete all quotes associated with a movie, when a movie is
movieSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Quote.deleteMany({ movie: doc._id });
    }
});

module.exports = mongoose.model("Movie", movieSchema);
