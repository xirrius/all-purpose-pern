const express = require('express');

const router = express.Router();

const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/multer');
const { getPosts, getPost, createPost, editPost, deletePost } = require('../controllers/post.controller');

router.get('/', authorize, getPosts)

router.get('/:id', authorize, getPost)

router.post('/', authorize, upload.single("file"), createPost)

router.put('/:id', authorize, upload.single("file"), editPost)

router.delete('/:id', authorize, deletePost)

module.exports = router

