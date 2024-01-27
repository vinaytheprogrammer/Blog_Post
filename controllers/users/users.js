const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");

const appErr = require("../../utils/appErr");


//register
const registerCtrl =  async(req, res, next) => {
    const {fullname, email, password } = req.body;

    //if email or password fields are empty
    if(!fullname || !email || !password){
        return next(appErr("All fields are Required"));
    }
    try{
        //1. check if user exist (email)
        const userFound = await User.findOne({email});
        
        // throw an error
        if(userFound)
        {
            return next(appErr("email already existed !"));
            // return res.json({status : "false", data : "email already existed !"});
        }


        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        //register user
        const user = await User.create({
            fullname,
            email,
            password : passwordHashed, // if we not initialize it than it will not going to hashed
        });

        res.json({
            status : "success",
            user: user,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
    }
};

//login
const loginCtrl = async(req, res, next) => {
    const {email, password} = req.body;

    //if email or password fields are empty
    if( !email || !password){
        return next(appErr("All fields are Required"));
    }
    try{

        //Check if email exist
        const userFound = await User.findOne({email});
        if(!userFound)
        {
            // throw an error
            return next(appErr("Invalid login email"));    
            // return res.json({status : "false", data : "Invalid login Credential !"});
        }
        
        //verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if(!isPasswordValid){
            // throw an error
            if(userFound)
            {
                // return res.json({status : "false", data : "Invalid login Credential !"});
                return next(appErr("Invalid login password"));
            }
        }


        //save the user info
        req.session.userAuth = userFound

        res.json({
            status : "success",
            user: userFound,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
    }
};


const detailsCtrl = async(req, res, next) => {
    try{

        //get userId from params
        const userId = req.params.id;
        //find the user
        const user = await User.findById(userId);
        // console.log(req.params);
        res.json({
            status : "success",
            data:  user,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));

    }
};


const profileCtrl = async(req, res, next) => {
    try{

        // get the login user
        const userId =req.session.userAuth;
        // find the user
        const user = await User.findById(userId).populate('posts').populate('comments');
        res.json({
            status : "success",
            data : user,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));

    }
};

const profileUploadCtrl = async(req, res, next) => {
    // console.log(req.file.path);
    try{
        //1. Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //2. Check if userr is found
        if(!userFound){
            return next(appErr("User not found",403));
        }

        //3. Update profile photo
        await User.findByIdAndUpdate(userId, {
            profileImage : req.file.path,
        },
        {
            new : true,
        });
        res.json({
            status : "success",
            data: userFound,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));

    }
};

const coverImgUploadCtrl = async(req, res, next) => {
    try{
        //1. Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        //2. Check if userr is found
        if(!userFound){
            return next(appErr("User not found",403));
        }

        //3. Update profile photo
        await User.findByIdAndUpdate(userId, {
            coverImage : req.file.path,
        },
        {
            new : true,
        });
        res.json({
            status : "success",
            data: userFound,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));

    }
};

const updatePassCtrl = async(req,res,next) => {
    const { password } = req.body;
    try{
        //Check if user is updating the password
        if(password){
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);

            //Update user

            await User.findByIdAndUpdate(
            req.params.id,{
                password : passwordHashed,
            },
            {
                new : true,
            }
        )
        res.json({
            status : "success",
            user: "Password hash been change Successfully",
        });
        }
        else
        {
            return next(appErr("Please provide password field"));
        }

        
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
        
    }
};

const updateUserCtrl = async(req,res,next) => {
    const { fullname, email} = req.body;
    try{
        //Check if email is taken 
        if(email)
        {
            const emailTaken = await User.findOne({email});
            if(emailTaken){
                return next(appErr("Email is taken",400));
            }
        }
        //update the user
        const user = await User.findByIdAndUpdate(req.params.id,{
            fullname,
            email,
        },
        {
            new : true,
        });
        res.json({
            status : "success",
            data : user,
        });
    }catch(error)
    {
        // res.json(error);
        next(appErr(error.message));
        // return next(appErr("email already existed !"));

    }
};

const logoutCtrl = async(req,res) => {
    try{
        res.json({
            status : "success",
            user: "User Logout",
        });
    }catch(error)
    {
        res.json(error);
    }
};


module.exports = {registerCtrl, loginCtrl, detailsCtrl, profileCtrl, profileUploadCtrl,  coverImgUploadCtrl, updatePassCtrl, updateUserCtrl, logoutCtrl};