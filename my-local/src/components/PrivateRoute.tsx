import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

interface PrivateRouteProps {
  children: any;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectTo = "/signin" }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Yuklanmoqda...
      </div>
    );
  }
  return user ? children : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
