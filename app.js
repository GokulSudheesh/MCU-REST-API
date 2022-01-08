require("./config/database");
const express = require("express");
const mongoSanitize = require('express-mongo-sanitize');
const routes = require("./routes");
const ExpressError = require("./utils/ExpressError");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use("/", routes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Route does not exist", 404));
})

// Error handling middle ware
app.use((err, req, res, next) => {
    console.log(err);
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal error. Something went wrong.'
    res.status(statusCode).json({ msg: err.message });
});

app.listen(port, () => {
    console.log(`[INFO] App listening at http://localhost:${port}`);
});