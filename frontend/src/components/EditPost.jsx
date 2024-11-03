import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, editExistingPost } from "../state/posts/postSlice";

const EditPost = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const dispatch = useDispatch();
  const selectedPost = useSelector((state) => state.posts.selectedPost);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null); // State for file input

  useEffect(() => {
    if (!selectedPost || selectedPost.id !== parseInt(id)) {
      dispatch(fetchPost(id)); // Fetch specific post if not already loaded
    } else {
      setTitle(selectedPost.title);
      setBody(selectedPost.body);
      setCategory(selectedPost.category);
    }
  }, [dispatch, id, selectedPost]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("category", category);
      formData.append("file", file);
      await dispatch(editExistingPost({ id, postData: formData }));
      navigate(-1);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">
            Body
          </label>
          <textarea
            className="form-control"
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Upload Image/Video
          </label>
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={(e) => setFile(e.target.files[0])} // Set the file state
            accept="image/*, video/*" // Accept both images and videos
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
