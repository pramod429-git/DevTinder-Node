const authAdmin = (req, res, next) => {
  const token = "xyz";
  const authorized = token == "xyz";
  console.log("checking for valid admin");
  if (!authorized) {
    res.status(401).send("unauthorized");
  } else {
    next();
  }
};
const authUser = (req, res, next) => {
  const token = "xyz";
  const authorized = token == "xyz";
  console.log("checking for valid User");
  if (!authorized) {
    res.status(401).send("unauthorized");
  } else {
    next();
  }
};
module.exports = { authAdmin, authUser };
