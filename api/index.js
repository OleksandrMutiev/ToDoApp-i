const { Router } = require("express");
const router = Router();
const { isAuthorized } = require("./middleware");

router.use("/auth", require("./auth/index"));

router.use("/todos", isAuthorized, require("./todos/index"));

router.use("/users", require("./users/index"));

module.exports = router;
