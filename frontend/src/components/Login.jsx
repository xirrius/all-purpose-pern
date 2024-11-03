import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../services/users";
import { setUser } from "../state/user/userSlice"; 

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await loginUser(body);
      if (response.token) {
        localStorage.setItem("token", response.token);
        dispatch(setUser( response.user )); 
        toast.success("Logged in Successfully");
      } else {
        toast.error(response);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Login failed, please try again."); 
    }
  };

  return (
    <>
      <h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm} className="mx-5 px-5">
        <input
          type="text"
          name="email"
          value={email}
          placeholder="Email"
          onChange={onChange}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={onChange}
          className="form-control my-3"
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register" className="mx-5 px-5">Register</Link>
    </>
  );
};

export default Login;
