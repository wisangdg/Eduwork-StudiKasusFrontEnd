import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axiosInstance from "../api/axiosInstance.js";
import Header from "../components/Header.jsx";
import Loading from "./Loading.jsx";
import "../styles/auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/register") {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/register") {
      setEmail("");
      setPassword("");
    }
  }, [location.pathname]);

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
    setLoading(true);
    try {
      console.log("Sending request to /auth/register with:", {
        email,
        password,
      });
      const response = await axiosInstance.post("/auth/register", {
        email: email,
        password: password,
      });
      console.log("Response:", response.data);
      alert("Register successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during registration:", error);
      alert(
        error.response?.data?.message || "Failed to register email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {loading ? (
        <Loading />
      ) : (
        <div className="register">
          <h1 className="register-title">Register</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={email}
              placeholder="Email"
              id="register-email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              id="register-button"
              disabled={!email || !password}
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;
