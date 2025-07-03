import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    productList: [],
    error: null,
}

const backendBaseUrl = process.env.VITE_BACKEND_URL || "";

export const addNewProduct = createAsyncThunk('product/addNewProduct', async (formData) => {
    const result = await axios.post(`${backendBaseUrl}/api/admin/products/add-product`, formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return result?.data;
});

export const fetchProduct = createAsyncThunk('product/get', async () => {
    const result = await axios.get(`${backendBaseUrl}/api/admin/products/get-product`);
    return result?.data;
});

export const deleteProduct = createAsyncThunk('product/delete', async ({id}) => {
    const result = await axios.delete(`${backendBaseUrl}/api/admin/products/delete-product/${id}`, {}, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return result?.data;
});

export const editProduct = createAsyncThunk('product/edit', async ({id, formData}) => {
    const result = await axios.put(`${backendBaseUrl}/api/admin/products/edit-product/${id}`, formData ,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return result?.data;
});

const adminProductSlice = createSlice({
    name: 'adminProductSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // fetchProduct
        .addCase(fetchProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = action.payload.data;
        })
        .addCase(fetchProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.productList = [];
            state.error = action.error.message;
        })
        // addNewProduct
        .addCase(addNewProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(addNewProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList.push(action.payload.data);
        })
        .addCase(addNewProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        // editProduct
        .addCase(editProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(editProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.productList.findIndex(p => p._id === action.payload.data._id);
            if (index !== -1) {
                state.productList[index] = action.payload.data;
            }
        })
        .addCase(editProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        // deleteProduct
        .addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = state.productList.filter(p => p._id !== action.meta.arg.id);
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addDefaultCase((state, action) => {
            
        })
    }
})

export default adminProductSlice.reducer;
