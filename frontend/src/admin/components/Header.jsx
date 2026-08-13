import {
  Bell,
  Menu,
  Search,
  Settings,
} from "lucide-react";

import { useSelector } from "react-redux";

const Header = ({ setSidebarOpen }) => {
  const { authUser } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800">

      <div className="h-20 px-6 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <div className="relative hidden md:block">

            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-80 bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 outline-none text-white"
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <button className="relative">

            <Bell className="w-6 h-6 text-slate-300" />

            <span className="absolute -top-2 -right-2 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">
              3
            </span>

          </button>

          <button>

            <Settings className="w-6 h-6 text-slate-300" />

          </button>

          <div className="flex items-center gap-3">

            <img
              src={
                authUser?.avatar?.url ||
                "https://ui-avatars.com/api/?name=Admin"
              }
              className="w-11 h-11 rounded-full object-cover"
            />

            <div className="hidden md:block">

              <h3 className="text-white font-semibold">
                {authUser?.name}
              </h3>

              <p className="text-sm text-slate-400">
                {authUser?.role}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;