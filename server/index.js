const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const controller = require("./controller.js");

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controller);

app.listen(port, () => console.log(`Listening on port ${port}`));
