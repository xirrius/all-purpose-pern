const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Authorization denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: payload.user_id, name: payload.user_name };
    next();
  } catch (error) {
    throw new UnauthorizedError("Authorization denied");
  }
};
