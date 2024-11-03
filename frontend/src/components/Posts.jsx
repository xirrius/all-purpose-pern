import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteExistingPost, fetchPosts } from "../state/posts/postSlice";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(fetchPosts({ page, limit, sortBy, order, search, category }));
  }, [dispatch, page, limit, sortBy, order, search, category]);

  const totalPages = Math.ceil(posts.total / limit);

  const getPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await dispatch(deleteExistingPost(postId));
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Posts</h1>

      <div className="d-flex justify-content-between mb-4">
        <input
          type="text"
          className="form-control me-2 mr-3"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          className="form-control me-2 mr-3"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select
          className="form-select me-2 mr-3"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="created_at">Created At</option>
          <option value="title">Title</option>
          <option value="category">Category</option>
        </select>
        <select
          className="form-select me-2 mr-3"
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="mb-3 text-center">
        <button
          className="btn btn-secondary me-2 mr-3"
          onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
        >
          Previous Page
        </button>
        {getPagination().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`btn ${
              page === pageNumber ? "btn-primary" : "btn-light"
            } me-1 mr-2`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="btn btn-secondary mr-3 ml-1"
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
        >
          Next Page
        </button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group">
        {posts.result &&
          posts.result.map((post) => (
            <li key={post.id} className="list-group-item mb-3">
              <h2>{post.title}</h2>
              <p className="text-muted">Category: {post.category}</p>
              <p>{post.body}</p>
              <p className="text-muted">
                Created At: {new Date(post.created_at).toLocaleString()}
              </p>
              <p className="text-muted">
                Created By: {post.user_name || "null"}
              </p>
              {post.file_url && (
                <div className="media-container">
                  {post.file_url.endsWith(".mp4") ||
                  post.file_url.endsWith(".mov") ||
                  post.file_url.endsWith(".avi") ? (
                    <video controls width="100%">
                      <source src={post.file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.file_url}
                      alt={post.title}
                      className="img-fluid"
                    />
                  )}
                </div>
              )}
              {post.user_id === posts.user && (
                <div className="mt-2">
                  <Link
                    className="btn btn-warning me-2 mr-3"
                    to={`/edit-post/${post.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Posts;
