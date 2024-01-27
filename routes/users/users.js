const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");

const {registerCtrl, loginCtrl, detailsCtrl, profileCtrl, profileUploadCtrl, coverImgUploadCtrl, updatePassCtrl, updateUserCtrl, logoutCtrl} = require("../../controllers/users/users");

const protected = require("../../middleware/protected");


const userRoutes = express.Router();



//instance of multer
const upload = multer({storage});





//-----------
//users routes
//------------

//POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);



//GET/api/v1/users/profile/            //-- it belongs to the creator only
userRoutes.get("/profile/", protected, profileCtrl);


//PUT/api/v1/users/profile-photo-upload/:id            //-- it belongs to the creator only upload profile image
userRoutes.put("/profile-photo-upload/", protected, upload.single('profile'), profileUploadCtrl);


//PUT/api/v1/users/cover-photo-upload/:id            //-- it belongs to the upload cover image
userRoutes.put("/cover-photo-upload/", protected, upload.single('profile'), coverImgUploadCtrl);


//PUT/api/v1/users/update-password/:id            //-- it belongs to the updating the user password
userRoutes.put("/update-password/:id", updatePassCtrl);


//PUT/api/v1/users/update/:id            //-- it belongs to the updating the user 
userRoutes.put("/update/:id", updateUserCtrl);



//GET/api/v1/users/:id
userRoutes.get("/:id", detailsCtrl);


//GET/api/v1/users/logout                     //-- it belongs to the logout
userRoutes.get("/logout", logoutCtrl);


module.exports = userRoutes;