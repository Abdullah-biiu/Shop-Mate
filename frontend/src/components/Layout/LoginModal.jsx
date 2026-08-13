import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { toggleAuthPopup } from "../../store/slices/popupSlice";

import {
  forgotPassword,
  register,
  login,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    authUser,
    isSigningUp,
    isLoggingIn,
    isRequestingForToken,
    isResettingPassword,
  } = useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Open reset password modal automatically
  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode("reset");

      if (!isAuthPopupOpen) {
        dispatch(toggleAuthPopup());
      }
    }
  }, [location.pathname, dispatch, isAuthPopupOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      data.append("name", formData.name);
    }

    // Forgot Password
    if (mode === "forgot") {
      await dispatch(
        forgotPassword({ email: formData.email })
      );

      dispatch(toggleAuthPopup());
      setMode("signin");

      return;
    }

    // Reset Password
    if (mode === "reset") {
      const token = location.pathname.split("/").pop();

      await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );

      return;
    }

    // Signup
    if (mode === "signup") {
      await dispatch(register(data));
    } else {
      // Signin
      await dispatch(login(data));
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading =
    isSigningUp ||
    isLoggingIn ||
    isRequestingForToken ||
    isResettingPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/40" />

      <div className="relative z-10 glass-panel w-full max-w-md mx-4 p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {mode === "reset"
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : "Welcome Back"}
          </h2>

          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg glass-card hover:opacity-80 transition"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {/* Email */}
          {mode !== "reset" && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {/* Password */}
          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {/* Confirm Password */}
          {mode === "reset" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {/* Forgot Password */}
          {mode === "signin" && (
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-primary hover:text-accent transition"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition
            ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90"
            } gradient-primary`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>
                  {mode === "reset"
                    ? "Resetting Password..."
                    : mode === "signup"
                    ? "Signing Up..."
                    : mode === "forgot"
                    ? "Sending Email..."
                    : "Signing In..."}
                </span>
              </>
            ) : mode === "reset" ? (
              "Reset Password"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "forgot" ? (
              "Send Reset Email"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Toggle */}
        {["signin", "signup"].includes(mode) && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() =>
                setMode((prev) =>
                  prev === "signup" ? "signin" : "signup"
                )
              }
              className="text-primary hover:text-accent transition"
            >
              {mode === "signup"
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;