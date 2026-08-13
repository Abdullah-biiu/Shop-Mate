import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/admin/fetch/dashboard-stats");

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    dashboard: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })

      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;