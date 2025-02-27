import axiosInstance from "../../api/axiosInstance.js";
import React, { useEffect, useState } from "react";
import { MdShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchCart } from "../../store.js";
import Loading from "../../pages/Loading";
import "../../styles/carts.css";

const CartList = () => {
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return price.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchCart(token));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError(error.response ? error.response.data : error);
        setLoading(false);
      }
    };

    if (isLoggedIn && token) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, token, dispatch]);

  useEffect(() => {
    // Update cartQty and totalPrice when cart changes
    if (cart) {
      setCartQty(cart.length);
      const total = Array.isArray(cart)
        ? cart.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const quantity = item.qty || 1; // Changed from item.quantity to item.qty
            return acc + price * quantity;
          }, 0)
        : 0;
      setTotalPrice(total);
    }
  }, [cart]);

  useEffect(() => {
    // Load selected address from localStorage
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, []);

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn || !token) {
      setError("You need to be logged in to checkout.");
      return;
    }

    const savedAddress = localStorage.getItem("selectedAddress");
    if (!savedAddress) {
      setError("Please select a delivery address first");
      return;
    }

    const deliveryAddress = JSON.parse(savedAddress);

    try {
      const response = await axiosInstance.post(
        "/api/orders",
        {
          delivery_fee: 10000,
          delivery_address: deliveryAddress._id, // Pastikan menggunakan ID alamat
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        try {
          // Clear cart
          await axiosInstance.delete("/api/carts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update local state
          dispatch(fetchCart(token));
          setIsCartVisible(false);
          setCheckoutStatus("Checkout successful!");

          // Redirect to orders page
          navigate("/orders", {
            state: {
              orderCreated: true,
              orderId: response.data._id,
            },
          });
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          setError("Order created but failed to clear cart");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || "Checkout failed";
      setError(errorMessage);
    }
  };

  const handleAddItem = async (id) => {
    try {
      // Update ke server
      await axiosInstance.put(
        `/api/carts/${id}`,
        { items: [{ product: { _id: id }, qty: 1 }] }, // menambah 1 quantity
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state lokal
      dispatch(fetchCart(token));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const item = cart.find((item) => item.product && item.product._id === id);
      if (item.qty === 1) {
        await axiosInstance.delete(`/api/carts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(fetchCart(token));
      } else {
        // Update ke server
        await axiosInstance.put(
          `/api/carts/${id}`,
          { items: [{ product: { _id: id }, qty: -1 }] }, // mengurangi  quantity
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(fetchCart(token));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message || error}</div>;
  if (!isLoggedIn) return <div>Please log in to view your cart.</div>;

  return (
    <div
      className="cart-container"
      style={{ position: "relative", display: "inline-block" }}
    >
      {cartQty > 0 && (
        <div className="cart-badge" style={{ opacity: 1 }}>
          {cartQty}
        </div>
      )}
      <button className="icons-button" onClick={toggleCartVisibility}>
        <MdShoppingCart size={17} />
      </button>

      {isCartVisible && (
        <div className="cart-list">
          {cart && cart.length > 0 ? (
            cart.map((cartItem) => (
              <div key={cartItem._id} className="cart-item">
                {cartItem.product && (
                  <>
                    <h3 className="cart-item-name">{cartItem.product.name}</h3>
                    <p className="cart-item-price">
                      Rp.{formatPrice(cartItem.product.price)}
                    </p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => handleRemoveItem(cartItem.product._id)}
                      >
                        -
                      </button>
                      <span>{cartItem.qty}</span>
                      <button
                        onClick={() => handleAddItem(cartItem.product._id)}
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No items in cart</p>
          )}
          {cart && cart.length > 0 && (
            <div>
              <h3 className="totalprice">
                Total Price: Rp.{formatPrice(totalPrice)}
              </h3>
              {!selectedAddress && (
                <p className="warning-text">
                  Please select a delivery address before checkout
                </p>
              )}
              <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={!selectedAddress}
              >
                Checkout
              </button>
              {error && <p className="error-text">{error}</p>}
              {checkoutStatus && <p>{checkoutStatus}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartList;
