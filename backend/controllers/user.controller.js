const bcrypt = require("bcrypt");
const pool = require("../database/db");
const generate = require("../utils/generate");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");
const sendEmail = require("../utils/mail");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    email,
  ]);

  if (user.rows.length > 0) {
    throw new UnauthorizedError("Invalid Credentials.");
  }

  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  let newUser = await pool.query(
    "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, bcryptPassword]
  );
  const token = generate(newUser.rows[0].user_id, newUser.rows[0].user_name);
  sendEmail(email, name);
  return res.status(StatusCodes.CREATED).json({
    user: {
      id: newUser.rows[0].user_id,
      name: newUser.rows[0].user_name,
      email: newUser.rows[0].user_email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    throw new UnauthorizedError("Invalid Credentials.");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].user_password
  );

  if (!validPassword) {
    throw new UnauthorizedError("Invalid Credentials.");
  }
  const token = generate(user.rows[0].user_id, user.rows[0].user_name);
  // sendEmail(email, user.rows[0].user_name);

  return res.status(StatusCodes.OK).json({
    user: {
      id: user.rows[0].user_id,
      name: user.rows[0].user_name,
      email: user.rows[0].user_email,
    },
    token,
  });
};

const verifyUser = async (req, res) => {
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    req.user.id,
  ]);
  res.json({
    user: {
      id: user.rows[0].user_id,
      name: user.rows[0].user_name,
      email: user.rows[0].user_email,
    },
  });
};

module.exports = { register, login, verifyUser };
