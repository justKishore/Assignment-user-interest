const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = 3000;

// body parser for url
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function () {
  console.log(`Server running art port ${port}`);
});
