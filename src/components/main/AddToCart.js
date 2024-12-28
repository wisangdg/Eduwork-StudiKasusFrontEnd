import axiosInstance from "../../api/axiosInstance.js";
import React from "react";
import { MdShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../store.js";
import "../../styles/main.css";

const AddToCart = ({ menu, onAddToCart }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleAddCart = async () => {
    try {
      const cartData = [
        {
          product: {
            _id: menu._id,
          },
          qty: 1,
        },
      ];

      await axiosInstance.post("/api/carts", cartData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchCart(token));
      if (onAddToCart) {
        onAddToCart();
      }
      alert("sukses menambahkan product");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <button onClick={handleAddCart}>
      <MdShoppingCart /> Add to Cart
    </button>
  );
};

export default AddToCart;
