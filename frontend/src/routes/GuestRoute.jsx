import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

export default function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  return <Outlet />;
}
