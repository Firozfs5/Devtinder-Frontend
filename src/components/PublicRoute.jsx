import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useSelector((store) => store.user);

  if (user) <Navigate to="/" replace />;
  return <Outlet />;
};

export default PublicRoute;
