const express = require("express");
const router = express.Router();
const Quote = require("./model");
const catchAsync = require("../../utils/catchAsync");
const { quotePostValidate, quoteDeleteValidate,
    quotePutValidate, quotePatchValidate } = require("../../middleware/validator");

router.route("/")
.get(async (req, res, next) => {
    const quotes = await Quote.find(req.query).populate("movie");
    res.status(200).json({ quotes });
})
.post(quotePostValidate, catchAsync(async (req, res, next) => {
    const newQuote = new Quote(req.body);
    newQuote.save();
    res.status(200).json({ msg: "Success!" });
}))
.delete(quoteDeleteValidate, async (req, res, next) => {
    const { id } = req.query;
    await Quote.deleteOne({ _id: id });
    res.status(200).json({ msg: "Success!" });
})
.put(quotePutValidate, catchAsync(async (req, res, next) => {
    const { id } = req.query;
    await Quote.findOneAndUpdate(
        { _id: id },
        req.body,
        { overwrite: true }
    );
    res.status(200).json({ msg: "Success!" });
}))
.patch(quotePatchValidate, catchAsync(async (req, res, next) => {
    const { id } = req.query;
    await Quote.findOneAndUpdate(
        { _id: id },
        { $set: req.body }
    );
    res.status(200).json({ msg: "Success!" });
}));

// Get a random quote from the collection
router.route("/random")
.get(catchAsync(async (req, res, next) => {
    const count = await Quote.countDocuments(req.query).exec();
    const random = Math.floor(Math.random() * count);
    const randomQuote = await Quote.findOne(req.query).populate("movie").skip(random).exec();
    res.status(200).json(randomQuote);
}));

module.exports = router;
