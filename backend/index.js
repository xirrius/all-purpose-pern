require("dotenv").config();
require("express-async-errors");

// extra security packages
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");

const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/not-found");

//middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
app.use("/users", userRouter);
app.use("/posts", postRouter);

//error handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  app.listen(port, () => {
    console.log(`Server is starting on port 5000`);
  });
};

start();

// multer aur cloudinary

// file upload
//emailing

// socketio, oauth, stripe payment
// forgot password
