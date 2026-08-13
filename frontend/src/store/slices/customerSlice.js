import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= Fetch Customers =================

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (page = 1, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/getallusers?page=${page}`
      );

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch customers"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// ================= Delete Customer =================

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/delete/${id}`
      );

      toast.success(data.message);

      return id;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete customer"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customer",

  initialState: {
    customers: [],
    totalUsers: 0,
    currentPage: 1,
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchCustomers.rejected, (state) => {
        state.loading = false;
      })

      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
        );

        state.totalUsers--;
      });
  },
});

export default customerSlice.reducer;