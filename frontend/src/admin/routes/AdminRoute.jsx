import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { authUser } = useSelector((state) => state.auth);

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  // We'll improve this after checking your auth object
  return <Outlet />;
};

export default AdminRoute;