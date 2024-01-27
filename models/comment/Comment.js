const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        },
        message : {
            type : String,
            required : true,
        },
    },
    {
        timestamps : true,
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;