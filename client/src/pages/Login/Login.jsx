import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setformData] = useState({});
  const navigate = useNavigate(); //redirect after after submit
  const { setToken, setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      if (data.success === true) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(
          {
            id:data.id,
            name:data.username,
            email:data.email
          })
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err.message);
    }

    // console.log(formData)
  };

  const addData = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <form
        action=""
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          name="email"
          onChange={(e) => {
            addData(e);
          }}
          placeholder="enter your email"
          required
        />
        <input
          type="password"
          name="password"
          onChange={(e) => {
            addData(e);
          }}
          placeholder="enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
