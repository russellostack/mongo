var mongoose = require("mongoose");

var Schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type:String,
        required: true
    },
    link: {
        type: String,
        required:true
    },
    saved: {
        type:Boolean,
        default:false
    },
    created:{
        type: Date,
        default:Date.now
    },
    articleTime:{
        type:String,
        required:true
    },
    note:[{
        type:Schema.Types.ObjectId,
        ref:"Note"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;