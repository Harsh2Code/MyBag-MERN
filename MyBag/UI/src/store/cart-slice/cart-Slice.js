import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      "https://mybag-server-mern.onrender.com/api/shop/cart/add",
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      `https://mybag-server-mern.onrender.com/api/shop/cart/get/${userId}`
    );
    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ _id }) => {
    const response = await axios.delete(
      `https://mybag-server-mern.onrender.com/api/shop/cart/${_id}`
    );
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      "https://mybag-server-mern.onrender.com/api/shop/cart/update-cart",
      {
        userId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (cartId) => {
    const response = await axios.delete(
      `https://mybag-server-mern.onrender.com/api/shop/cart/clear/${cartId}`
    );
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCartAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
