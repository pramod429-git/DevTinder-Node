const validator = require("validator");
const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!(firstName && lastName && emailId && password)) {
    throw new Error("field cannot be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("invalid emailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("not a strong password");
  }
};

const validateLogin = (req) => {
  const { emailId, password } = req.body;

  if (!(emailId && password)) {
    throw new Error("field cannot be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("invalid emailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("not a strong password");
  }
};

const validateEditProfile = (req) => {
  if (!req.age) {
    throw new Error("field cannot be empty");
  }
  const AllowedProfileUpadteFileds = ["skills", "about", "age", "photoUrl"];
  const isEditAllowed = Object.keys(req).every((field) =>
    AllowedProfileUpadteFileds.includes(field)
  );
  return isEditAllowed;
};

const validateForgotPassword = (req) => {
  if (!req.password) {
    throw new Error("field cannot be empty");
  } else if (!validator.isStrongPassword(req.password)) {
    throw new Error("weak password");
  }
};
module.exports = {
  validateSignUp,
  validateLogin,
  validateEditProfile,
  validateForgotPassword,
};
