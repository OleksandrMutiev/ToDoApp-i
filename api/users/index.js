const { Router } = require("express");
const router = Router();
const { validate } = require("../middleware");

const { registerUser } = require("./users.controller");
const { registerUserValidation } = require("./users.validation");

router.post("/register", validate(registerUserValidation), registerUser);

module.exports = router;
