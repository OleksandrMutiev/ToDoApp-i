const UsersModel = require("./users.model");

exports.registerUser = async (req, res, next) => {
  try {
    const user = new UsersModel(req.body);
    await user.save();
    res.send({ success: true });
  } catch (e) {
    next(e);
  }
};
