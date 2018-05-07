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
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

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


//ROUTES -in controller

// // Show any mongoose errors
// db.on("error", function (error) {
//     console.log("Mongoose Error: ", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function () {
//     console.log("Mongoose connection successful.");
// });




// //route to get the articles from the database
// app.get("/", function (req, res) {
//     db.Article.find({}).sort({ "_id": -1 })
//         .then(function (dbArticle) {
//             //res.json(dbArticle);
//             //console.log( dbArticle);
//             res.render("index", { articles: dbArticle });
//         })
//         .catch(function (err) {
//             res.json(err);
//         })

// })

// //route for grabbing a specific article by id and populate with a note

// app.get("/articles/:id", function (req, res) {
//     db.Article.findOne({ _id: req.params.id })
//         .populate("note")
//         .then(function (dbArticle) {
//             res.json(dbArticle)
//         })
//         .catch(function (err) {
//             console.log(" err find by id ", err);
//             res.json(err);
//         });
// })

// run the populate method with "note"
//the responds with the article with the note included
//Route for saving/updating an Articles associated Note

// app.post("/articles/:id", function (req, res) {
//     // TODO
//     // ====
//     // save the new note that gets posted to the Notes collection
//     // then find an article from the req.params.id
//     // and update it's "note" property with the _id of the new note
//     db.Note.create(req.body)
//         .then(function (dbNote) {
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//         })
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             console.log(" error in post", err);
//             res.json(err);
//         })

// })


//start the server
app.listen(PORT, function () {
    console.log("App running on Port: ", PORT);
})