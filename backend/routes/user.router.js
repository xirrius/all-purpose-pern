const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const authorize = require("../middlewares/authorize");
const { register, login, verifyUser } = require("../controllers/user.controller");

router.post('/register', validate, register)

router.post('/login', validate, login)

router.get('/verify', authorize, verifyUser)

module.exports = router;
