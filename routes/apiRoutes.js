var mongoose = require("mongoose");

var axios = require("axios");
var cherrio = require("cheerio");

var db = require("../models");

module.exports = function(app){
    app.get("/", function(req,res){
        db.Articlefind({
            "saved":false
        },function (err, data){
            var hbsObject = {
                article:data
            };
            res.render("index", hbsObject);
        });
    });

    app.get("/saved", function(req,res){
        db.Article.find({
            "saved":true
        }).populate("notes")
        .exec(function(error,articles){
            var hbsObject={
                article:articles
            };
            res.render("saved", hbsObject);
        });
    });

    app.get("/scrape", function(req,res){
        axios.get("https://www.elnuevodia.com/ultimas-noticias/").then(function(response){
            var $ = cheerio.load(response.data);

            $(".story-summary").each(function (i, elem){
                var result = {};
                result.title = $(this).find(".story-summary-title").text();
                result.link = "https://www.nytimes.com/"+  $(this).find("a").attr("href");
                result.summary = $(this).find(".story-summary-body").text();
                result.srticleTime = $(this).find("story-summary-date").text();

                db.Article.create(result).catch(function(err){
                    console.log(err);
                });
            });
        });
    });

    app.get("/articles", function(req,res){
        db.Article.find({}).sort({
            created:-1
        }).then(function(dbArticle){
            res.json(dbArticle);
        });
    });

    app.put("/article/save/:id", function(req,res){
        var id = req.params.id;
        db.Article.findOneAndUpdate({
            _id:id
        },{"saved":true})
        .then(function(dbArticle){
            res.json(dbArticle);
        });
    });
    app.post("/articles/delete/:id", function (req, res) {
        db.Article.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "saved": false,
            "notes": []
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        });
    });

    app.get("/article/clear", function (req, res) {
        db.Article.deleteMany({})
            .then(function (dbArticle) {
                res.render("/");
            });
            res.send(true)
    });

    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        note: dbNote._id
                    }
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/note/delete/:id", function (req, res) {
        db.Note.findByIdAndDelete({
                "_id": req.params.id
            })
            .then(function (dbNote) {
            });
        res.send(true)
    });
};