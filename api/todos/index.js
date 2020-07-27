const { Router } = require("express");
const router = Router();
const { validate, isAdmin, isSameUserOrAdmin } = require("../middleware");

const {
  getNotArchiveTodos,
  getArchiveTodos,
  getActiveTodos,
  getDoneTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
  getTodosStatisticByUser
} = require("./todos.controller");
const { createTodoValidation } = require("./todos.validation");

router.get("/statistic", getTodosStatisticByUser);

router.get("/unarchive", getNotArchiveTodos);

router.get("/archive", getArchiveTodos);

router.get("/active", getActiveTodos);

router.get("/done", getDoneTodos);

router.post("/create", validate(createTodoValidation), createTodo);

router.put(
  "/update/:todo_id",
  validate(createTodoValidation),
  isSameUserOrAdmin,
  updateTodo
);

router.delete("/delete/:todo_id", isSameUserOrAdmin, deleteTodo);

router.get("/admin", isAdmin, getAllTodos);
module.exports = router;
