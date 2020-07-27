const joi = require("@hapi/joi");
const { Segments } = require("celebrate");

exports.registerUserValidation = {
  [Segments.BODY]: {
    email: joi
      .string()
      .email()
      .lowercase()
      .required(),
    password: joi
      .string()
      .min(6)
      .max(100)
      .required(),
    login: joi
      .string()
      .min(1)
      .max(50)
      .required(),
    firstName: joi
      .string()
      .min(1)
      .max(100),
    lastName: joi
      .string()
      .min(1)
      .max(100)
  }
};
