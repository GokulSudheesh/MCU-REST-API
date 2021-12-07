require("./config/database");
const express = require("express");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", routes);

// Error handling middle ware
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(500).json({ msg: "Internal error. Something went wrong." });
});

app.listen(port, () => {
    console.log(`[INFO] App listening at http://localhost:${port}`);
});