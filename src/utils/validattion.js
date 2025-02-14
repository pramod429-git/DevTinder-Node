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
module.exports = { validateSignUp };
