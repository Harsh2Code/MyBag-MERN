import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = 'https://mybag-server-mern.onrender.com';

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

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
      `${API_BASE_URL}/api/shop/products/get?${query.toString()}`
    );

    console.log(result);

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${API_BASE_URL}/api/shop/products/get/${id}`
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
    resetLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
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

export const { setProductDetails, resetLoading } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;



































// import axios from 'axios';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     isLoading: false,
//     productList: [],
// };

// // adding product to cart
// export const addNewProduct = createAsyncThunk('product/addNewProduct', async (formData) => {
//     const result = await axios.post('https://mybag-server-mern.onrender.com/api/admin/products/add-product', formData, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return result?.data;
// });

// export const fetchProduct = createAsyncThunk('product/get', async () => {
//     const result = await axios.get('https://mybag-server-mern.onrender.com/api/admin/products/get-product');
//     return result?.data;
// });

// export const deleteProduct = createAsyncThunk('product/delete', async ({ id }) => {
//     const result = await axios.post(`https://mybag-server-mern.onrender.com/api/admin/products/delete-product/${id}`, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return result?.data;
// });

// export const editProduct = createAsyncThunk('product/edit', async ({ id, formData }) => {
//     const result = await axios.post(`https://mybag-server-mern.onrender.com/api/admin/products/edit-product/${id}`, formData, {
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