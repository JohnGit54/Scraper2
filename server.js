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
app.engine("handlebars" , exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scraper_controller.js");
app.use("/", routes);

//connect to Mongo DB
mongoose.connect("mongodb://localhost/scraperdb");


//ROUTES


//a GET route for scraping the Bridgewater Patch website

app.get("/scrape", function (req, res) {
    console.log("top app get scrape");
    //grab body of html with request
    //axios.get("https://patch.com/new-jersey/bridgewater")
    axios.get("https://www.nytimes.com/").then(function (response) {
        //then we load the html into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        var  articles = [];
        //now grab every H2 within an article tag
        $("article h2").each(function (i, element) {
            var result = {};
            result._id = i;
            result.title = $(this).children("a").text().trim();
            result.link = $(this).children("a").attr("href");
            //console.log(result.link, "  ", result.title);
            articles.push(result);

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });

        });

        //if we werw able to succesfully scrape and save ARticle
        console.log("articles scraped: " , articles.length);
        res.send(  "scrape complete");
        //res.json(articles);
    });
});


//route to get the articles from the database
app.get("/", function (req, res) {
    db.Article.find({}).sort({ "_id": -1 })
        .then(function (dbArticle) {
            //res.json(dbArticle);
            //console.log( dbArticle);
            res.render("index" , { articles: dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        })

})

//route for grabbing a specific article by id and populate with a note

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
           console.log(" err find by id ", err);
            res.json(err);
        });
})

// run the populate method with "note"
//the responds with the article with the note included
//Route for saving/updating an Articles associated Note

app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err){
            console.log(" error in post" ,err);
            res.json(err);
        })
         
})


//start the server
app.listen(PORT, function () {
    console.log("App running on Port: ", PORT);
})