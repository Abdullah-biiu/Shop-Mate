import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ShoppingCart,
  Users,
  UserCircle,
  LogOut,
  Package,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    path: "/admin/products",
  },
  {
    title: "Add Product",
    icon: PlusCircle,
    path: "/admin/products/new",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/admin/profile",
  },
];

const Sidebar = ({ closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="h-20 border-b border-slate-800 flex items-center justify-center">

        <div className="flex items-center gap-3">

          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-3 rounded-xl shadow-lg">
            <Package className="text-white w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              ShopMate
            </h1>

            <p className="text-xs text-slate-400">
              Admin Dashboard
            </p>
          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="px-5 pt-6">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
          Main Menu
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">

        <div className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={closeSidebar}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />

                <span className="font-medium">
                  {item.title}
                </span>
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* User Card */}

      <div className="p-4 border-t border-slate-800">

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-lg">

          <div className="flex items-center gap-3">

            <div className="relative">

              <NavLink to="/admin/profile">

                <img
                  src={
                    authUser?.avatar?.url ||
                    `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(
                      authUser?.name || "Admin"
                    )}`
                  }
                  alt="Admin"
                  className="w-14 h-14 rounded-full object-cover hover:ring-4 hover:ring-indigo-500 transition duration-300"
                />

              </NavLink>

              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-800 rounded-full"></span>

            </div>

            <div className="overflow-hidden">

              <NavLink to="/admin/profile">

                <h3 className="text-white font-semibold truncate hover:text-indigo-400 transition">
                  {authUser?.name || "Administrator"}
                </h3>

              </NavLink>

              <p className="text-xs text-slate-400 truncate">
                {authUser?.email}
              </p>

              <p className="text-xs text-indigo-400 mt-1">
                {authUser?.role || "Admin"}
              </p>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all rounded-xl py-3 font-medium text-white"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;