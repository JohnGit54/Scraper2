//setting up server.js with boiler plate code

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
//adding the logger morgan - similar to example
var logger = require("morgan");

//using axios - similar to example
var axios = require("axios");

var cheerio = require("cheerio");

//require all models
// Requiring our /models -Note and Article models 

var db = require('./models');


var PORT = process.env.PORT || 3000;

//initialize Express
var app = express();

//configure middleware

//use morgan logger for logging requests
app.use(logger("dev"));

//use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

//use express.static to serve the public folder
app.use(express.static("public"));

//set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scraper_controller.js");
app.use("/", routes);

//connect to Mongo DB
mongoose.connect("mongodb://localhost/scraperdb");
  

//ROUTES moved into controllers/scraper_controller.js


//start the server
app.listen(PORT, function () {
    console.log("App running on Port: ", PORT);
})