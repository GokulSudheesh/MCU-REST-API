const mongoose = require('mongoose');
const { Schema } = mongoose;

const quoteSchema = new Schema(
    {
        quote: { type: String, required: true },
        character: { type: String, required: true },
        movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true }
    }
);
module.exports = mongoose.model("Quote", quoteSchema);
