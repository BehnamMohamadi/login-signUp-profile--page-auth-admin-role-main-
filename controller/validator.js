const Joi = require("joi");

const signUpValidator = () => {
  return (request, response, next) => {
    const { firstname, lastname, username, password, gender } = request.body;

    const schema = Joi.object({
      firstname: Joi.string().min(3).max(30).required(),
      lastname: Joi.string().min(3).max(30).required(),
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      gender: Joi.string().trim() ?? "not-set",
    });

    const { error } = schema.validate({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      gender: gender,
    });

    if (error) {
      return response.status(400).json({
        status: "fail",
        data: {
          message: error.details[0].message,
        },
      });
    }

    next();
  };
};

const updateValidator = () => {
  return (request, response, next) => {
    const updatedUser = request.body.data;
    const newInfo = {};
    for (const property of updatedUser) {
      newInfo[property.id] = property.value;
    }

    const schema = Joi.object({
      firstname: Joi.string().min(3).max(30).required(),
      lastname: Joi.string().min(3).max(30).required(),
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      gender: Joi.string().trim() ?? "not-set",
    });

    const { error } = schema.validate({
      firstname: newInfo.firstname,
      lastname: newInfo.lastname,
      username: newInfo.username,
      password: newInfo.password,
      gender: newInfo.gender,
    });

    if (error) {
      return response.status(400).json({
        status: "fail",
        data: {
          message: error.details[0].message,
        },
      });
    }

    next();
  };
};
module.exports = { signUpValidator, updateValidator };
