const Comment = require("../../models/comment/Comment");
const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const createCtrl = async(req,res,next) => {
    const {message} = req.body;
    console.log(message);
    try{
        //Find the post
        const post = await Post.findById(req.params.id);
        //Create the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
        });
        // console.log(comment);
        //Push the comment to post
        post.comments.push(comment._id);
        //find the user
        const user = await User.findById(req.session.userAuth);
        //push the comment into
        user.comments.push(comment._id);
        //disable validation
        //save..
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });
        res.json({
            status : "success",
            // user: "Comment Created",
            data : comment,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error));
    }
};


const single_commentCtrl = async(req, res, next) => {
    try{
        res.json({
            status : "success",
            user: "Comment Details",
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error));

    }
};


const deleteCtrl = async(req, res, next) => {
    try{
        //find the post
        const comment = await Comment.findById(req.params.id);
        //check if the post belongs to the user
        if(comment.user.toString() !== req.session.userAuth._id.toString())
        {
            return next(appErr("You are not allowed to delete this comment" , 403));
        }
        //delete post
        const deletedPost = await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status : "success",
            user: "Comment has been Deleted Successfully",
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error));

    }
};

const updateCtrl = async(req, res, next) => {
    try{
        //find the comment
        const comment = await Comment.findById(req.params.id);
        
        if(!comment)
        {
            return next(appErr("comment is not found"));
        }
        //check if the post belongs to the user
        if(comment.user.toString() !== req.session.userAuth._id.toString())
        {
            return next(appErr("You are not allowed to Update this comment" , 403));
        }
        //update
        await Comment.findByIdAndUpdate(req.params.id, {
            message : req.body.message,
        },{
            new : true,
        });

        res.json({
            status : "success",
            data : comment,
        })
    }catch(error)
    {
        // res.json(error);
        next(appErr(error));
    }
};

module.exports = { createCtrl, single_commentCtrl, deleteCtrl, updateCtrl};