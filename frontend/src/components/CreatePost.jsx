import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewPost } from "../state/posts/postSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null); // State for file input
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("category", category);
    formData.append("file", file);

    // Dispatch the createNewPost action with the form data
    await dispatch(createNewPost(formData));

    // Clear the input fields
    setTitle("");
    setBody("");
    setCategory("");
    setFile(null); // Reset file input

    // Navigate to the posts page after successful post creation
    navigate("/posts");
  };

  return (
    <div className="container mt-5">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            rows="3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
            required
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
