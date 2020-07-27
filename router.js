const { join } = require("path");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { Strategy } = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const UsersModel = require("./api/users/users.model");

const router = express.Router();

router.use(express.static(join(__dirname, "client")));

passport.use(
  "local",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    UsersModel.localStrategyAuth.bind(UsersModel)
  )
);

passport.serializeUser(UsersModel.serializeUser.bind(UsersModel));

passport.deserializeUser(UsersModel.deserializeUser.bind(UsersModel));

router.use(cookieParser());

router.use(
  session({
    secret: "secret string",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: false },
    proxy: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      stringify: false
    })
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.use(express.json());

router.use("/api", require("./api/index"));

router.use((err, req, res, next) => {
  let e = { message: "" };
  if (err.joi) {
    e = err.joi.details;
  } else if (err.name === "MongoError") {
    e.message = err.errmsg;
  } else {
    e = err;
  }
  if (!Array.isArray(e)) {
    e = [e];
  }
  res.status(e.status || 400).send(e);
});

module.exports = router;
