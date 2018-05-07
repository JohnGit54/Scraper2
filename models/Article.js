

//Article collection

var mongoose = require("mongoose");

var Schema = mongoose.Schema;


//using the Schema constructor, create a new UserCechema object
// Similar to Sequeize model

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: false
    },
    
    link: {
        type: String,
        required: true
    },

    //note is an object that stores a Note Id
    // The ref property links the ObjectId to the Note modeil
    // This allows us to populate the Article with an associated Note

    note:{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

//This creates our modle from the above schema, 
//using mongoose's model method

var Article = mongoose.model("Article" , ArticleSchema) ;

//export the Article model
module.exports = Article;