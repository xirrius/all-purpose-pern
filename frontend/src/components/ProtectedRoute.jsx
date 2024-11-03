import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
const loading = useSelector((state) => state.user.loading);

  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
