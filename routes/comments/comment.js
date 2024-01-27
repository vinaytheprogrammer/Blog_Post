const express = require("express");
const {createCtrl, single_commentCtrl,deleteCtrl, updateCtrl, } = require("../../controllers/comments/comments");



const protected = require("../../middleware/protected");

const commentRoutes = express.Router();




//-----------
//comments routes
//------------



//POST/api/v1/comments
commentRoutes.post("/:id", protected, createCtrl);



//GET/api/v1/comments/:id
commentRoutes.get("/:id", single_commentCtrl);


//DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", protected, deleteCtrl);


//PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, updateCtrl);


module.exports = commentRoutes;