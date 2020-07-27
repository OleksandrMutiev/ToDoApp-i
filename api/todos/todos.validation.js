const joi = require("@hapi/joi");
const { Segments } = require("celebrate");

exports.createTodoValidation = {
  [Segments.BODY]: {
    title: joi
      .string()
      .min(1)
      .max(100)
      .required(),
    text: joi
      .string()
      .min(1)
      .required(),
    deadline: joi
      .date()
      .min("now")
      .required(),
    createdBy: joi.string(),
    active: joi.boolean(),
    archive: joi.boolean()
  }
};
