var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3001;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI ||"mongodb://localhost/mongoScraper";
mongoose.connect(MONGODB_URI);

app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/apiroutes")(app);

app.listen(PORT, function(){
    console.log("app running on port: " + PORT);
})