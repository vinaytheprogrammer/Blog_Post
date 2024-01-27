const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {createCtrl, allCtrl, detailsCtrl, deleteCtrl, updateCtrl} = require("../../controllers/posts/posts");


const postRoutes = express.Router();
const protected = require("../../middleware/protected");


//instance of multer
const upload = multer({
    storage,
});


//-----------
//posts routes
//------------


//POST/api/v1/posts
postRoutes.post("/", protected, upload.single('file'), createCtrl);

//GET/api/v1/posts
postRoutes.get("/", allCtrl);


//GET/api/v1/posts/:id
postRoutes.get("/:id", detailsCtrl);


//DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, deleteCtrl);


//PUT/api/v1/posts/:id
// postRoutes.put("/:id", protected, upload.single("file"), updateCtrl);
postRoutes.put("/:id",  protected, updateCtrl);


module.exports = postRoutes;