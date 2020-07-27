const { Router } = require("express");
const router = Router();

const { validate } = require("../middleware");

const { loginUser, logoutUser, auth } = require("./auth.controller");
const { authUserValidation } = require("./auth.validation");

router.post("/login", validate(authUserValidation), auth(), loginUser);

router.get("/logout", logoutUser);

module.exports = router;
