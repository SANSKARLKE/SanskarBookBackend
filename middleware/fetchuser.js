const jwt = require("jsonwebtoken");

const WEBTOKEN_SIGNATURE = "webtoken_signature";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ message: "invalid token" });
  }
  try {
    const string = jwt.verify(token, WEBTOKEN_SIGNATURE);
    req.user = string.user;
  } catch (e) {
    res.status(401).send({ message: "invalid token" });
  }

  next();
};

module.exports = fetchuser;
