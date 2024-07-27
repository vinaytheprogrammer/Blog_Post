const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  registerCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");

// New login controller
const loginUserCtrl = async (req, res) => {
  // ... (existing login logic)
  // After successful login
  const returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
};

const userRoutes = express.Router();
const upload = multer({ storage });

// Rendering forms
userRoutes.get("/login", (req, res) => {
  res.render("users/login", { error: "" });
});

userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});

userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});

userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});

// User routes
userRoutes.post("/register", upload.single("profile"), registerCtrl);

// Updated login route
userRoutes.post("/login", loginUserCtrl);

userRoutes.get("/profile-page", protected, profileCtrl);

userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);

userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("profile"),
  uploadCoverImgCtrl
);

userRoutes.put("/update-password/", updatePasswordCtrl);

userRoutes.put("/update", updateUserCtrl);

userRoutes.get("/logout", logoutCtrl);

userRoutes.get("/:id", userDetailsCtrl);

module.exports = userRoutes;