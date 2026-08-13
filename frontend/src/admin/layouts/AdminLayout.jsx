import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../admin/components/Sidebar";
import Header from "../admin/components/Header";
// import Products from "../pages/AdminProducts";
// import AddProduct from "../pages/AddProduct";
// import EditProduct from "../pages/EditProduct";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="relative">
            <Sidebar
              closeSidebar={() => setSidebarOpen(false)}
            />
          </div>

        </div>
      )}

      <div className="flex-1 flex flex-col">

        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-8 overflow-auto">

          <Outlet />

        </main>


      </div>
      <Route index element={<Dashboard />} />

<Route
    path="products"
    element={<Products />}
/>

<Route
    path="products/new"
    element={<AddProduct />}
/>

<Route
    path="products/edit/:id"
    element={<EditProduct />}
/>

    </div>
  );
};

export default AdminLayout;