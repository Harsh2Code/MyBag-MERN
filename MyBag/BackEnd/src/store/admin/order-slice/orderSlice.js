import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};
const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "";


// Async thunk to fetch orders from backend
export const fetchOrders = createAsyncThunk(
  'adminOrders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('${backendBaseUrl}/api/admin/orders/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  }
);

// Async thunk to create a new order
export const createNewOrder = createAsyncThunk(
  'adminOrders/createNewOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post('${backendBaseUrl}/api/shop/order/create', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating order');
    }
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendBaseUrl}/api/admin/orders/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add the new order to orders array or refresh orders list
        state.orders.push(action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the order in the orders array
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
