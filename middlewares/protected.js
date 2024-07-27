const protected = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    // Store the intended destination
    req.session.returnTo = req.originalUrl;
    // Redirect to login page
    res.redirect('/login');
  }
};

module.exports = protected;