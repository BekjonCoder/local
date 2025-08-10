import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          KuchBirlikda
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/signin">
                <Button type="default">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button type="primary">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-600 font-medium">
                {user.displayName || user.email}
              </span>
              <Button danger onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
