import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../services/users";
import { setUser } from "../state/user/userSlice"; 

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { email, password, name } = inputs;

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
      const body = { email, password, name };
      const parseRes = await registerUser(body);

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        dispatch(setUser(parseRes.user)); 
        toast.success("Registered Successfully");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Registration failed, please try again.");
    }
  };

  return (
    <>
      <h1 className="mt-5 text-center">Register</h1>
      <form onSubmit={onSubmitForm} className="mx-5 px-5">
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={onChange}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={onChange}
          className="form-control my-3"
        />
        <input
          type="text"
          name="name"
          value={name}
          placeholder="name"
          onChange={onChange}
          className="form-control my-3"
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/login" className="mx-5 px-5">Login</Link>
    </>
  );
};

export default Register;
