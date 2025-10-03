import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  paymentURL: null,
  isLoading: false,
  orderId: null,
  merchantTransactionId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(`${API_BASE}/api/shop/order/create`, orderData);

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ merchantTransactionId, orderId }) => {
    const response = await axios.post(`${API_BASE}/api/shop/order/capture`, {
      merchantTransactionId,
      orderId,
    });

    return response.data;
  }
);

export const checkPaymentStatus = createAsyncThunk(
  "/order/checkPaymentStatus",
  async (merchantTransactionId) => {
    const response = await axios.get(`${API_BASE}/api/shop/order/payment-status/${merchantTransactionId}`);
    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(`${API_BASE}/api/shop/order/list/${userId}`);

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(`${API_BASE}/api/shop/order/details/${id}`);

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
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
        state.paymentURL = action.payload.paymentUrl;
        state.orderId = action.payload.orderId;
        state.merchantTransactionId = action.payload.merchantTransactionId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
        sessionStorage.setItem(
          "merchantTransactionId",
          JSON.stringify(action.payload.merchantTransactionId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.paymentURL = null;
        state.orderId = null;
        state.merchantTransactionId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
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
