const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router.js");

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => console.log(`Listening on port ${port}`));
