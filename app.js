const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = 3000;

// body parser for url
app.use(bodyParser.urlencoded({ extended: true }));
// for serving statics files like our css or images from local machine
app.use(express.static("public"));

// Sending signup page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const interest = req.body.interest;
  const email = req.body.email;
  const password = req.body.password;
  const obj = { fname, interest, email, password };
  console.log(obj);
});

//login
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", function (req, res) {
  res.send("LOGIN POST IN DEVELOPMENT");
});

app.listen(port, function () {
  console.log(`Server running art port ${port}`);
});
