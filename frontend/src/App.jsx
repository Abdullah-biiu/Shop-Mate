import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Loader } from "lucide-react";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./admin/routes/AdminRoute";

// Customer Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";
import AdminOrders from "./admin/pages/Orders";
import Customers from "./admin/pages/Customers";
import Profile from "./admin/pages/Profile";

// Redux
import { getUser } from "./store/slices/authSlice";
import { fetchAllProducts } from "./store/slices/productSlice";

const App = () => {
  const dispatch = useDispatch();

  const { authUser, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  const { products } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: "",
        price: "0-10000",
        search: "",
        rating: "",
        availability: "",
        page: 1,
      })
    );
  }, [dispatch]);

  if ((isCheckingAuth && !authUser) || !products) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= CUSTOMER ================= */}

          <Route element={<MainLayout />}>

            <Route path="/" element={<Index />} />

            <Route
              path="/password/reset/:token"
              element={<Index />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/payment"
              element={<Payment />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/faq"
              element={<FAQ />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

          </Route>

          {/* ================= ADMIN ================= */}

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminLayout />}
            >

              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="products/new"
                element={<AddProduct />}
              />

              <Route
                path="products/edit/:id"
                element={<EditProduct />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="users"
                element={<Customers />}
              />

              <Route
                path="profile"
                element={<Profile />}
              />

            </Route>

          </Route>

          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />

      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;