const passport = require("passport");

exports.auth = () => {
  return (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) return next(error);
      req.logIn(user, function(error) {
        if (error) return next(error);
        next();
      });
    })(req, res, next);
  };
};

exports.loginUser = async (req, res, next) => {
  try {
    await res.json({
      success: true,
      response: { user: req.session.passport.user }
    });
  } catch (e) {
    next(e);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.logOut();
    req.session.destroy();
    res.clearCookie("connect.sid");
    await res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
