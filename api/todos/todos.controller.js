const TodoModel = require("./todos.model");
const escapeStringRegexp = require("escape-string-regexp");
const { sortByQuery, compareDates } = require("./todos.helpers");

exports.getNotArchiveTodos = async (req, res, next) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;
  const sort = sortByQuery(req.query.sort) || { createdAt: -1 };
  const search = new RegExp(escapeStringRegexp(req.query.search || ""));

  try {
    const todos = await TodoModel.find({
      archive: false,
      createdBy: req.user._id,
      title: search
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!todos) throw new Error("Todos not found");

    return res.json({
      success: true,
      response: todos
    });
  } catch (err) {
    next(err);
  }
};

exports.getArchiveTodos = async (req, res, next) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 10;
    const sort = sortByQuery(req.query.sort) || { createdAt: -1 };
    const search = new RegExp(escapeStringRegexp(req.query.search || ""));

    const todos = await TodoModel.find({
      archive: true,
      createdBy: req.user._id,
      title: search
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!todos) throw new Error("Todos not found");

    return res.json({
      success: true,
      response: todos
    });
  } catch (err) {
    next(err);
  }
};

exports.getActiveTodos = async (req, res, next) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 10;
    const sort = sortByQuery(req.query.sort) || { createdAt: -1 };
    const search = new RegExp(escapeStringRegexp(req.query.search || ""));

    const todos = await TodoModel.find({
      archive: false,
      active: true,
      createdBy: req.user._id,
      title: search
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!todos) throw new Error("Todos not found");

    return res.json({
      success: true,
      response: todos
    });
  } catch (err) {
    next(err);
  }
};

exports.getDoneTodos = async (req, res, next) => {
  try {
    const skip = +req.query.skip || 0;
    const limit = +req.query.limit || 10;
    const sort = sortByQuery(req.query.sort) || { createdAt: -1 };
    const search = new RegExp(escapeStringRegexp(req.query.search || ""));

    const todos = await TodoModel.find({
      archive: false,
      active: false,
      createdBy: req.user._id,
      title: search
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!todos) throw new Error("Todos not found");

    return res.json({
      success: true,
      response: todos
    });
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      response: todo
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todo_id).exec();

    if (!todo) {
      throw new Error("Todo Not Found");
    }

    await todo.delete();

    return res.json({
      success: true
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todo_id).exec();

    if (!todo) {
      throw new Error("Todo Not Found");
    }

    Object.assign(todo, req.body);
    await todo.save();

    return res.json({
      success: true,
      response: todo
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({})
      .lean()
      .exec();

    if (!todos) throw new Error("Todos not found");

    if (req.query.sort) {
      sortByQuery(todos, req.query.sort);
    }

    return res.json({
      success: true,
      response: todos
    });
  } catch (err) {
    next(err);
  }
};

exports.getTodosStatisticByUser = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({ createdBy: req.user._id }).exec();

    if (!todos) {
      throw new Error("Todos Not Found");
    }

    const statistic = todos.reduce(
      (acc, todo) => {
        acc.total++;
        if (todo.archive) {
          acc.archive++;
        } else if (todo.active) {
          acc.active++;
        } else {
          acc.done++;
        }

        if (compareDates(todo.deadline)) {
          acc.deadline++;
        }
        return acc;
      },
      {
        total: 0,
        archive: 0,
        active: 0,
        done: 0,
        deadline: 0
      }
    );

    return res.json({
      success: true,
      response: statistic
    });
  } catch (err) {
    next(err);
  }
};
