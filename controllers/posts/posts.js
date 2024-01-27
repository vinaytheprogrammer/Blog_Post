const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//Create
const createCtrl = async(req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    const {title, description, category, image, user} = req.body;
    try{
        if( !title || !description || !category || !req.file){
            return next(appErr("All fields are required"));
        }
        //Find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //Create the posts
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image : req.file.path,  // cloudinary sends back the image in req.file.path location
        });
        //push the post created into the array of user's posts
        userFound.posts.push(postCreated._id);
        // reSave
        await userFound.save();
        res.json({
            status : "success",
            // user: "Post Created",
            data : postCreated,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
    }
};

const allCtrl = async(req, res, next) => {
    try{
        const posts = await Post.find().populate('comments');
        res.json({
            status : "success",
            // user: "Post List",
            data : posts,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));

    }
};


const detailsCtrl = async(req, res, next) => {
    try{
        // get the id from params
        const id = req.params.id;
        //find the post
        const post = await Post.findById(id).populate('comments');
        res.json({
            status : "success",
            // user: "Post Details",
            data : post,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
    }
};

const deleteCtrl = async(req, res, next) => { 
    try{
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to the user
        
        if(post.user.toString() !== req.session.userAuth._id.toString())
        {
            return next(appErr("You are not allowed to delete this post" , 403));
        }
        //delete post
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        res.json({
            status : "success",
            user: "Post has been Deleted Successfully",
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
    }
};


const updateCtrl = async(req, res, next) => {
    const { title, description, category } = req.body;
    
    try{
        //find the post 
        const post = await Post.findById(req.params.id);
        // check if the post belongs to the user
        if(post.user.toString() !== req.session.userAuth._id.toString())
        {
            return next(appErr("You are not allowed to Update this post" , 403));
        }
        
        console.log("Hi");
        const postUpdated = await Post.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            image : req.file.path,
        },
        {
          new: true,
        });
        res.json({
            status : "success",
            user: "Post Updated",
            // data : postUpdated,
        });
    }catch(error)
    {
        res.json(error);
    }
};


module.exports = { createCtrl, allCtrl, detailsCtrl, deleteCtrl, updateCtrl};