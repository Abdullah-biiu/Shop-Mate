import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/orders/my-orders");

      return data.orders;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch orders";

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",

  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;