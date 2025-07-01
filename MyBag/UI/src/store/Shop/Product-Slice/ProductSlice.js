

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

const backendBaseUrl = process.env.VITE_BACKEND_URL || "";

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");
    console.log('backendBaseUrl:', backendBaseUrl);

    try {
      // Manually serialize filterParams arrays as comma-separated strings
      const serializedParams = {};
      for (const key in filterParams) {
        if (Array.isArray(filterParams[key])) {
          serializedParams[key] = filterParams[key].join(',');
        } else {
          serializedParams[key] = filterParams[key];
        }
      }

      const query = new URLSearchParams({
        ...serializedParams,
        sortBy: typeof sortParams === 'string' ? sortParams : JSON.stringify(sortParams),
      });

      const result = await axios.get(
        `${backendBaseUrl}/api/shop/products/get?${query.toString()}`
      );

      console.log('API response:', result);
      console.log('Response data:', result.data);

      // Check if response data is JSON object or array
      if (typeof result.data === 'string' && result.data.startsWith('<!DOCTYPE html>')) {
        console.error('API returned HTML instead of JSON:', result.data);
        return [];
      }

      return result?.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${backendBaseUrl}/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fetchAllFilteredProducts.fulfilled payload:', action.payload);
        console.log('payload type:', typeof action.payload);
        if (action.payload && Array.isArray(action.payload.data)) {
          state.productList = action.payload.data;
        } else if (action.payload && Array.isArray(action.payload)) {
          state.productList = action.payload;
        } else if (action.payload && typeof action.payload === 'object' && action.payload !== null) {
          // Try to extract array from object values if possible
          const values = Object.values(action.payload);
          if (values.length === 1 && Array.isArray(values[0])) {
            state.productList = values[0];
          } else {
            console.error('Unexpected object payload structure:', action.payload);
            state.productList = [];
          }
        } else {
          console.error('Unexpected payload structure in fetchAllFilteredProducts.fulfilled:', action.payload);
          state.productList = [];
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;



































// import axios from 'axios';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     isLoading: false,
//     productList: [],
// };

// // adding product to cart
// export const addNewProduct = createAsyncThunk('product/addNewProduct', async (formData) => {
//     const result = await axios.post(`${backendBaseUrl}/api/admin/products/add-product`, formData, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return result?.data;
// });

// export const fetchProduct = createAsyncThunk('product/get', async () => {
//     const result = await axios.get(`${backendBaseUrl}/api/admin/products/get-product`);
//     return result?.data;
// });

// export const deleteProduct = createAsyncThunk('product/delete', async ({ id }) => {
//     const result = await axios.post(`${backendBaseUrl}/api/admin/products/delete-product/${id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return result?.data;
// });

// export const editProduct = createAsyncThunk('product/edit', async ({ id, formData }) => {
//     const result = await axios.post(`${backendBaseUrl}/api/admin/products/edit-product/${id}`, formData, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return result?.data;
// });

// const adminProductSlice = createSlice({
//     name: 'adminProductSlice',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchProduct.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(fetchProduct.fulfilled, (state, action) => {
//                 console.log(action.payload);

//                 state.isLoading = false;
//                 state.productList = action.payload.data;
//             })
//             .addCase(fetchProduct.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.productList = [];
//             });
//     },
// });

// export default adminProductSlice.reducer;
