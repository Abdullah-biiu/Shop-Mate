import { X, Home, Package, Info, HelpCircle, ShoppingCart, List, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.popup);

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "About", icon: Info, path: "/about" },
    { name: "FAQ", icon: HelpCircle, path: "/faq" },
    { name: "Contact", icon: Phone, path: "/contact" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    authUser && { name: "My Orders", icon: List, path: "/orders" },
  ];

  if (!isMenuOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(toggleMenu())}
      />

      {/* sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 z-50 glass-panel">

        {/* header */}
        <div className="flex justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-primary">Menu</h2>
          <button onClick={() => dispatch(toggleMenu())}>
            <X />
          </button>
        </div>

        {/* menu */}
        <nav className="p-6 space-y-2">
          {menuItems.filter(Boolean).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => dispatch(toggleMenu())}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

      </div>
    </>
  );
};

export default Sidebar;