const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (user_id, user_name) {
  return jwt.sign(
    {
      user_id,
      user_name,
    },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
