import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "https://shop-mate-zrwr.onrender.com/api/v1",

  // Required for cross-origin cookies
  withCredentials: true,
});

// ============================
// REQUEST INTERCEPTOR
// ============================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================
// RESPONSE INTERCEPTOR
// ============================

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      // Remove stale JWT
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);