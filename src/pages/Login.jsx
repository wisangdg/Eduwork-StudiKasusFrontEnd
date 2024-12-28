import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance.js";
import Header from "../components/Header.jsx";
import { setCredentials } from "../store";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      console.log("Sending request to /auth/login with:", { email, password });
      const response = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("Response:", response.data);

      if (response.status === 200) {
        const { token, user } = response.data;
        // Simpan credentials ke Redux store
        dispatch(
          setCredentials({
            token: token,
            user: user,
          })
        );
        // Redirect ke halaman home atau dashboard
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.message || "Failed to submit email or password"
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            placeholder="Email"
            id="login-email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            id="login-button"
            disabled={!email || !password}
          >
            Login
          </button>
        </form>
        <p>or</p>
        <button type="submit" id="register-redirect">
          <Link to={"/register"} className="register-link">
            Sign Up
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Login;
