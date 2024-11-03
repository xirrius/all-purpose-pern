import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verifyUser } from "../services/users";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../state/user/userSlice"; 

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const getProfile = async () => {
    try {
      const res = await verifyUser();
      setName(res.user.name); 
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      dispatch(clearUser()); 
      toast.success("Logout successfully");
      navigate("/login"); 
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Home</h1>
      <h2 className="mb-4">Welcome, {user ? user.name : name}</h2>

      <div className="mb-3">
        <button onClick={(e) => logout(e)} className="btn btn-danger me-2 mr-3">
          Logout
        </button>
        <Link to="/posts" className="btn btn-primary me-2 mr-3">
          Posts
        </Link>
        <Link to="/create-post" className="btn btn-success">
          Add a Post
        </Link>
      </div>
    </div>
  );
};

export default Home;
