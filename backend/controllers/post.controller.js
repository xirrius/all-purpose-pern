const fs = require('fs')
const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ServerError,
} = require("../errors");
const uploadOnCloudinary = require("../utils/cloudinary");

const getPosts = async (req, res) => {
  const {
    page,
    limit,
    sortBy = "created_at",
    order,
    search,
    category,
  } = req.query;

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;
  const offset = (pageNum - 1) * limitNum;

  let countQuery = "SELECT COUNT(*) FROM posts WHERE 1=1";
  let baseQuery =
    "SELECT posts.*, users.user_name FROM posts JOIN users ON posts.user_id = users.user_id WHERE 1=1";

  let queryParams = [];
  let countParams = [];

  if (search) {
    baseQuery += ` AND title ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${search}%`);

    countQuery += ` AND title ILIKE $${countParams.length + 1}`;
    countParams.push(`%${search}%`);
  }

  if (category) {
    baseQuery += ` AND LOWER(category) = LOWER($${queryParams.length + 1})`;
    queryParams.push(category);
    countQuery += ` AND category = $${countParams.length + 1}`;
    countParams.push(category);
  }

  if (sortBy) {
    const sortOrder = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
    baseQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
  } else {
    baseQuery += ` ORDER BY created_at ASC`;
  }

  baseQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(limitNum, offset);

  console.log("Base Query:", baseQuery);
  console.log("Query Params:", queryParams);

  const result = await pool.query(baseQuery, queryParams);
  const totalResult = await pool.query(countQuery, countParams);
  res.status(StatusCodes.OK).json({
    result: result.rows,
    total: parseInt(totalResult.rows[0].count),
    user: req.user.id,
  });
};

const getPost = async (req, res) => {
  const { id } = req.params;

  const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  if (!post.rows[0]) {
    throw new NotFoundError("Post not found.");
  }
  res.status(StatusCodes.OK).json(post.rows[0]);
};

const createPost = async (req, res) => {
  const { title, body, category } = req.body;
  const user_id = req.user.id;

  if (!title || !body || !category) {
    throw new BadRequestError("Title, body, and category are required.");
  }

  let fileUrl = null; 

  if (req.file) {
    const localFilePath = req.file.path;
    fileUrl = await uploadOnCloudinary(localFilePath);

    if (!fileUrl) {
      throw new ServerError("File upload failed.");
    }

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });
  }

  const newPost = await pool.query(
    `INSERT INTO posts (title, body, category, user_id, file_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, body, category, user_id, fileUrl]
  );

  return res.status(StatusCodes.CREATED).json(newPost.rows[0]);
};

const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, body, category } = req.body;
  const userId = req.user.id;

  if (!title || !body || !category) {
    throw new BadRequestError("Title, body and category are required.");
  }
    let fileUrl = null;

    if (req.file) {
      const localFilePath = req.file.path;
      fileUrl = await uploadOnCloudinary(localFilePath);

      if (!fileUrl) {
        throw new ServerError("File upload failed.");
      }

      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Failed to delete local file:", err);
        }
      });
    }

  const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  if (!post.rows[0]) {
    throw new NotFoundError("Post not found.");
  }
  if (post.rows[0].user_id !== userId) {
    throw new UnauthorizedError("Unauthorized to edit this post.");
  }

  await pool.query(
    "UPDATE posts SET title = $1, body = $2, category = $3, file_url = $4 WHERE id = $5",
    [title, body, category, fileUrl, id]
  );
  res.status(StatusCodes.OK).json({ message: "Post updated successfully" });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  if (!post.rows[0]) {
    throw new NotFoundError("Post not found.");
  }
  if (post.rows[0].user_id !== userId) {
    throw new UnauthorizedError("Unauthorized to delete this post.");
  }
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  res.json({ message: "Post deleted successfully" });
};

module.exports = { getPosts, getPost, createPost, editPost, deletePost };

