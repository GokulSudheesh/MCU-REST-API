const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema(
    {
        title: { type: String, required: true },
        phase: { type: Number, required: true },
        release: { type: Date, required: true },
        imdb: { type: Number }
    }
);
module.exports = mongoose.model("Movie", movieSchema);
