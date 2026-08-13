import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ================= FETCH ADDRESSES =================
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/address");
      return data.addresses;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch addresses.");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ================= ADD ADDRESS =================
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (address, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/address/add", address);

      toast.success(data.message);

      return data.address;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address.");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ================= UPDATE ADDRESS =================
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (address, thunkAPI) => {
    try {
      const { id, ...formData } = address;

      const { data } = await axiosInstance.put(
        `/address/${id}`,
        formData
      );

      toast.success(data.message);

      return data.address;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address.");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ================= DELETE ADDRESS =================
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/address/${id}`);

      toast.success("Address deleted successfully.");

      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address.");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ================= SET DEFAULT ADDRESS =================
export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.put(`/address/default/${id}`);

      toast.success("Default address updated.");

      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update default address.");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",

  initialState: {
    addresses: [],
    loading: false,
    error: null,

    // Selected address for checkout
    selectedAddress: null,

    // Address being edited
    editingAddress: null,
  },

  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setEditingAddress: (state, action) => {
      state.editingAddress = action.payload;
    },

    clearEditingAddress: (state) => {
      state.editingAddress = null;
    },

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;

        const defaultAddress = action.payload.find(
          (item) => item.is_default
        );

        if (defaultAddress) {
          state.selectedAddress = defaultAddress;
        }
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ADD =================
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
      })

      // ================= UPDATE =================
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.addresses[index] = action.payload;
        }

        if (
          state.selectedAddress &&
          state.selectedAddress.id === action.payload.id
        ) {
          state.selectedAddress = action.payload;
        }

        state.editingAddress = null;
      })

      // ================= DELETE =================
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (item) => item.id !== action.payload
        );

        if (
          state.selectedAddress &&
          state.selectedAddress.id === action.payload
        ) {
          state.selectedAddress = null;
        }
      })

      // ================= DEFAULT =================
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((item) => ({
          ...item,
          is_default: item.id === action.payload,
        }));

        const defaultAddress = state.addresses.find(
          (item) => item.id === action.payload
        );

        if (defaultAddress) {
          state.selectedAddress = defaultAddress;
        }
      });
  },
});

export const {
  selectAddress,
  setEditingAddress,
  clearEditingAddress,
  clearSelectedAddress,
} = addressSlice.actions;

export default addressSlice.reducer;