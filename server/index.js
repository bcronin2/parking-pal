const express = require("express");
const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require('cors');
const controller = require("./controller.js");

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controller);

app.listen(port, () => console.log(`Listening on port ${port}`));
