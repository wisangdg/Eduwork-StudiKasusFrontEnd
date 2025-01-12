import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axiosInstance from "../src/api/axiosInstance.js";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    isLoggedIn: !!localStorage.getItem("token"),
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});

const tagSlice = createSlice({
  name: "tags",
  initialState: {
    activeTags: [],
  },
  reducers: {
    addTag: (state, action) => {
      const newTag = { ...action.payload, className: "activeTags" };
      if (state.activeTags.find((tag) => tag._id === newTag._id)) {
        state.activeTags = state.activeTags.filter(
          (tag) => tag._id !== newTag._id
        );
      } else {
        state.activeTags.push(newTag);
      }
    },
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const { addTag } = tagSlice.actions;
export const { setCart } = cartSlice.actions;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token, { dispatch }) => {
    const response = await axiosInstance.get("/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setCart(response.data));
  }
);

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tags: tagSlice.reducer,
    cart: cartSlice.reducer,
  },
});
