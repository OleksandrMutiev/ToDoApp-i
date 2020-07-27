const { celebrate } = require("celebrate");
const TodosModel = require("./todos/todos.model");

exports.validate = schema => {
  return (req, res, next) => {
    celebrate(schema, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: {
        objects: true
      }
    })(req, res, next);
  };
};

const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  next({ status: 401, message: "Not authorized" });
};
exports.isAuthorized = isAuthorized;

exports.isSameUserOrAdmin = (req, res, next) => {
  isAuthorized(req, res, err => {
    if (
      (!err && req.user.role === "admin") ||
      userHasAccess(req.user._id, req.params.todo_id, next)
    ) {
      return next();
    }
    next(err || { status: 403, message: "Has no permission" });
  });
};

exports.isAdmin = (req, res, next) => {
  isAuthorized(req, res, err => {
    if (!err && req.user.role === "admin") {
      return next();
    }
    next(err || { status: 403, message: "Has no permission" });
  });
};

const userHasAccess = async (user_id, todo_id, next) => {
  try {
    const todo = await TodosModel.findOne({ _id: todo_id, createdBy: user_id })
      .lean()
      .exec();

    if (!todo) {
      throw new Error("Forbidden");
    }

    return true;
  } catch (e) {
    next(e);
  }
};
