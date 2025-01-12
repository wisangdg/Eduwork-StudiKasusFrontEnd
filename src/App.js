import axiosInstance from "./api/axiosInstance.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation } from "react-router";
import { setCredentials, logout } from "./store";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Orders from "./pages/Orders.jsx";
import Invoices from "./components/Invoices.jsx";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // State for search keyword

  const checkLoginStatus = async () => {
    try {
      if (!token) {
        dispatch(logout());
        return;
      }

      const response = await axiosInstance.get("/auth/me", {
        // Use axiosInstance
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        dispatch(
          setCredentials({
            token: token,
            user: response.data,
          })
        );
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(logout());
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/categories"); // Use axiosInstance
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  const location = useLocation();

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchKeyword={searchKeyword}
              handleSearchChange={handleSearchChange}
              categories={categories}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<Register key={location.pathname} />}
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        <Route path="/invoices/:orderId" element={<Invoices />} />
      </Routes>
    </div>
  );
}

export default App;
