var mongoose= require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title:{
        type: Schema.Types.ObjectId,
        ref:"Article"
    },
    body:String,
    created:{
        type:Date,
        default:Date.now
    }
});

var Note = mongoose.model("Note", NoteSchema);
module.exports=Note;