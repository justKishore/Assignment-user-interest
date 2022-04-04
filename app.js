const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

var loginStatus = 0;

// MongoDB

// Connecting to the Database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Interests");

// Creating a Database Schema
var nameSchema = new mongoose.Schema({
  fname: String,
  interest: Number,
  email: String,
  password: String,
});

// Creating Model
var User = mongoose.model("User", nameSchema);

// body parser for json format
app.use(bodyParser.json());

// body parser for url
app.use(bodyParser.urlencoded({ extended: true }));

// for serving statics files like our css or images from local machine
app.use(express.static("public"));

// Sending signup page
app.get("/", function (req, res) {
  loginStatus = 0;
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  // const fname = req.body.fname;
  // const interest = req.body.interest;
  // const email = req.body.email;
  // const password = req.body.password;
  // const obj = { fname, interest, email, password };
  // console.log(obj);

  var myData = new User(req.body);
  myData
    .save()
    .then((item) => {
      res.sendFile(__dirname + "/success.html");
    })
    .catch((err) => {
      // res.status(400).send("unable to save to database");
      res.status(400).sendFile("/failure.html");
    });
});

//login
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

// validate login
app.post("/login", function (req, res) {
  // res.send("LOGIN POST IN DEVELOPMENT");
  var Lemail = req.body.email;
  var Lpassword = req.body.password;
  var available = false;
  var postion = 0;

  User.find()
    .then((item) => {
      // res.send(item);
      // const dbEmail = item[0].email;
      // const dbPassword = item[0]
      // console.log(Lemail, Lpassword);
      for (let i = 0; i < item.length; i++) {
        if (Lemail === item[i].email) {
          // console.log(item[i].email + "   " + Lemail);
          available = true;
          postion = i;
          break;
        }
      }
      if (Lpassword == item[postion].password) {
        // res.send("Login Success");
        loginStatus = 1;
        const Linterest = item[postion].interest;
        console.log();
        if (Linterest === 1) {
          res.redirect("/jokes");
        }
        if (Linterest === 2) {
          res.redirect("/pictures");
        }
        if (Linterest === 3) {
          res.redirect("/quotes");
        }
      } else {
        // res.send("Login failed");
        res.sendFile(__dirname + "/login-failure.html");
      }
      // console.log("Position is : " + postion);
    })
    .catch((err) => {
      res.send({ err });
      console.log(err);
    });
});

// Interest

// 1. jokes

app.get("/jokes", function (req, res) {
  // res.send("Jokes");

  if (loginStatus === 1) {
    const url =
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&type=twopart";
    https.get(url, function (response) {
      console.log(response.statusCode);
      response.on("data", function (data) {
        const jokeData = JSON.parse(data);
        //   res.send(jokeData);
        console.log(jokeData);
        const jokeQ = jokeData.setup;
        const jokeA = jokeData.delivery;
        //   console.log(jokeQ);

        res.set("Content-Type", "text/html");
        res.write(`<h3> Q: ${jokeQ} </h3> </br>`);
        res.write("<h3>A:" + jokeA + "</h3>");
        res.write(
          '<form action="/jokes" method="get"><button class="btn btn-dark btn-lg" type="submit">One More</button></form>'
        );
        res.send();
      });
    });
  } else {
    res.redirect("/login");
  }
});

// 2. pictures
app.get("/pictures", function (req, res) {
  // res.send("pictures");
  if (loginStatus === 1) {
    const imgurl = "https://random.imagecdn.app/500/500";
    res.set("Content-Type", "text/html");
    res.write("<img src=" + imgurl + "> </br></br>");
    res.write(
      '<form action="/pictures" method="get"><button class="btn btn-dark btn-lg" type="submit">One More</button></form>'
    );
    res.send();
  } else {
    res.redirect("/login");
  }
});

// 3. quotes
app.get("/quotes", function (req, res) {
  // res.send("quotes");
  if (loginStatus === 1) {
    const url = "https://api.kanye.rest/";
    https.get(url, function (response) {
      console.log(response.statusCode);
      response.on("data", function (data) {
        const quoteData = JSON.parse(data);
        //   res.send(quoteData.quote);
        console.log(quoteData);

        res.set("Content-Type", "text/html");
        res.write(`<h3> ${quoteData.quote} </h3> </br>`);
        res.write(
          '<form action="/quotes" method="get"><button class="btn btn-dark btn-lg" type="submit">One More</button></form>'
        );
        res.send();
      });
    });
  } else {
    res.redirect("/login");
  }
});

// success and failure route
app.post("/success", function (req, res) {
  // take back to login page or login route
  res.redirect("/login");
});

app.post("/failure", function (req, res) {
  // take back to home page or home route
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Server running art port ${port}`);
});

// router.get('/findall', function(req, res) {
//   StudentModel.find(function(err, data) {
//       if(err){
//           console.log(err);
//       }
//       else{
//           res.send(data);
//       }
//   });
// });
