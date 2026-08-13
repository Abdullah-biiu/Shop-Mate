import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

/* =========================
   REGISTER
========================= */
export const register = createAsyncThunk(
  "auth/register",

  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/register",
        data
      );

      toast.success(res.data.message);

      thunkAPI.dispatch(
        toggleAuthPopup()
      );

      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Registration failed"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data
          ?.message
      );
    }
  }
);

/* =========================
   LOGIN
========================= */
export const login = createAsyncThunk(
  "auth/login",

  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      toast.success(res.data.message);

      thunkAPI.dispatch(
        toggleAuthPopup()
      );

      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Login failed"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data
          ?.message
      );
    }
  }
);

/* =========================
   GET USER
========================= */
export const getUser = createAsyncThunk(
  "auth/getUser",

  async (_, thunkAPI) => {
    try {
      const res =
        await axiosInstance.get(
          "/auth/me"
        );

      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data
          ?.message ||
          "Failed to get user"
      );
    }
  }
);

/* =========================
   LOGOUT
========================= */
export const logout = createAsyncThunk(
  "auth/logout",

  async (_, thunkAPI) => {
    try {
      const res =
        await axiosInstance.get(
          "/auth/logout"
        );

      toast.success(
        res.data.message
      );

      return null;
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Logout failed"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data
          ?.message
      );
    }
  }
);

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword =
  createAsyncThunk(
    "auth/forgotPassword",

    async (email, thunkAPI) => {
      try {
        const res =
          await axiosInstance.post(
            "/auth/password/forgot?frontendUrl=http://localhost:5173",
            email
          );

        toast.success(
          res.data.message
        );

        return null;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to send email"
        );

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message
        );
      }
    }
  );

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword =
  createAsyncThunk(
    "auth/resetPassword",

    async (
      {
        token,
        password,
        confirmPassword,
      },
      thunkAPI
    ) => {
      try {
        const res =
          await axiosInstance.put(
            `/auth/password/reset/${token}`,
            {
              password,
              confirmPassword,
            }
          );

        toast.success(
          res.data.message
        );

        return res.data.user;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Reset password failed"
        );

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message
        );
      }
    }
  );

/* =========================
   UPDATE PASSWORD
========================= */
export const updatePassword =
  createAsyncThunk(
    "auth/updatePassword",

    async (data, thunkAPI) => {
      try {

        console.log("PASSWORD DATA:", data);

        const res =
          await axiosInstance.put(
            "/auth/password/update",
            {
              currentPassword:
                data.currentPassword,

              newPassword:
                data.newPassword,

              confirmPassword:
                data.confirmPassword,
            }
          );

        toast.success(
          res.data.message
        );

        return res.data;

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Password update failed"
        );

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message
        );
      }
    }
  );

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile =
  createAsyncThunk(
    "auth/updateProfile",

    async (data, thunkAPI) => {
      try {
        const res =
          await axiosInstance.put(
            "/auth/profile/update",
            data
          );

        toast.success(
          res.data.message
        );

        return res.data.user;
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Profile update failed"
        );

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message
        );
      }
    }
  );

/* =========================
   SLICE
========================= */

const authSlice = createSlice({
  name: "auth",

  initialState: {
    authUser: null,

    isSigningUp: false,
    isLoggingIn: false,

    isUpdatingProfile: false,
    isUpdatingPassword: false,

    isRequestingForToken: false,

    isCheckingAuth: true,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(
        register.pending,
        (state) => {
          state.isSigningUp = true;
        }
      )

      .addCase(
        register.fulfilled,
        (state, action) => {
          state.isSigningUp =
            false;

          state.authUser =
            action.payload;
        }
      )

      .addCase(
        register.rejected,
        (state) => {
          state.isSigningUp =
            false;
        }
      )

      /* LOGIN */
      .addCase(
        login.pending,
        (state) => {
          state.isLoggingIn = true;
        }
      )

      .addCase(
        login.fulfilled,
        (state, action) => {
          state.isLoggingIn =
            false;

          state.authUser =
            action.payload;
        }
      )

      .addCase(
        login.rejected,
        (state) => {
          state.isLoggingIn =
            false;
        }
      )

      /* GET USER */
      .addCase(
        getUser.pending,
        (state) => {
          state.isCheckingAuth =
            true;
        }
      )

      .addCase(
        getUser.fulfilled,
        (state, action) => {
          state.isCheckingAuth =
            false;

          state.authUser =
            action.payload;
        }
      )

      .addCase(
        getUser.rejected,
        (state) => {
          state.isCheckingAuth =
            false;

          state.authUser = null;
        }
      )

      /* LOGOUT */
      .addCase(
        logout.fulfilled,
        (state) => {
          state.authUser = null;
        }
      )

      /* FORGOT PASSWORD */
      .addCase(
        forgotPassword.pending,
        (state) => {
          state.isRequestingForToken =
            true;
        }
      )

      .addCase(
        forgotPassword.fulfilled,
        (state) => {
          state.isRequestingForToken =
            false;
        }
      )

      .addCase(
        forgotPassword.rejected,
        (state) => {
          state.isRequestingForToken =
            false;
        }
      )

      /* RESET PASSWORD */
      .addCase(
        resetPassword.pending,
        (state) => {
          state.isUpdatingPassword =
            true;
        }
      )

      .addCase(
        resetPassword.fulfilled,
        (state, action) => {
          state.isUpdatingPassword =
            false;

          state.authUser =
            action.payload;
        }
      )

      .addCase(
        resetPassword.rejected,
        (state) => {
          state.isUpdatingPassword =
            false;
        }
      )

      /* UPDATE PASSWORD */
      .addCase(
        updatePassword.pending,
        (state) => {
          state.isUpdatingPassword =
            true;
        }
      )

      .addCase(
        updatePassword.fulfilled,
        (state) => {
          state.isUpdatingPassword =
            false;
        }
      )

      .addCase(
        updatePassword.rejected,
        (state) => {
          state.isUpdatingPassword =
            false;
        }
      )

      /* UPDATE PROFILE */
      .addCase(
        updateProfile.pending,
        (state) => {
          state.isUpdatingProfile =
            true;
        }
      )

      .addCase(
        updateProfile.fulfilled,
        (state, action) => {
          state.isUpdatingProfile =
            false;

          state.authUser =
            action.payload;
        }
      )

      .addCase(
        updateProfile.rejected,
        (state) => {
          state.isUpdatingProfile =
            false;
        }
      );
  },
});

export default authSlice.reducer;