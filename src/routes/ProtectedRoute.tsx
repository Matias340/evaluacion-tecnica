import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles: ("TALLER" | "CLIENTE")[];
  children: JSX.Element;
}

export const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
