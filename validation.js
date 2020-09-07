const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateTodoInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.creator = !isEmpty(data.creator) ? data.creator : "";
  data.duration = !isEmpty(data.duration) ? data.duration : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required.";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  if (Validator.isEmpty(data.creator)) {
    errors.description = "Creator field is required";
  }

  if (Validator.isEmpty(data.duration)) {
    errors.description = "Duration field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
