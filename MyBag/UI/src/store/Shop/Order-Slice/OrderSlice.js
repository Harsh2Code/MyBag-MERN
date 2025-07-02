
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

const backendBaseUrl = 'https://mybag-mern-1.onrender.com';

export const createNewOrder = createAsyncThunk(
  '/order/createNewOrder',
  async (orderData) => {
    const response = await axios.post(
      `${backendBaseUrl}/api/shop/order/create`,
      orderData
    );

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  '/order/capturePayment',
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      `${backendBaseUrl}/api/shop/order/capture`,
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  '/order/getAllOrdersByUserId',
  async () => {
    const response = await axios.get(
      `${backendBaseUrl}/api/shop/order/list`,
      {
        withCredentials: true,
      }
    );
    console.log('getAllOrdersByUserId response:', response.data);
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  '/order/getOrderDetails',
  async (id) => {
    const response = await axios.get(
      `${backendBaseUrl}/api/shop/order/details/${id}`
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: 'shoppingOrderSlice',
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          'currentOrderId',
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('getAllOrdersByUserId fulfilled payload:', action.payload);
        if (action.payload && typeof action.payload === 'object') {
          console.log('Payload keys:', Object.keys(action.payload));
          if (action.payload.success && Array.isArray(action.payload.data)) {
            state.orderList = action.payload.data;
          } else {
            console.warn('Payload data is not an array or success is false:', action.payload);
            state.orderList = [];
          }
        } else {
          console.warn('Payload is not an object:', action.payload);
          state.orderList = [];
        }
        console.log('Current orderList type:', typeof state.orderList, Array.isArray(state.orderList));
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
