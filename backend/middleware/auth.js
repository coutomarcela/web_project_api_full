const jwt = require("jsonwebtoken");

module.exports.authorization = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send();
  }
  const token = authorization.replace("Bearer", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send();
  }
  req.user = payload;
  next();
};
