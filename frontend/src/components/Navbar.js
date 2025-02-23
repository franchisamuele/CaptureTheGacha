import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken.role : null;

  const handleLogout = async () => {
    try {
      await axios.post("https://localhost/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("playerId");
      navigate("/player/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("playerId");
      navigate("/player/login");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Gacha World
        </Link>

        <div className="space-x-4">
          {token ? (
            <>
              {role === "admin" ? (
                <>
                  <Link to="/admin/gachas" className="hover:text-gray-300">
                    Gachas
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/player/dashboard" className="hover:text-gray-300">
                    Dashboard
                  </Link>
                  <Link to="/player/collection" className="hover:text-gray-300">
                    Collection
                  </Link>
                  <Link to="/player/history" className="hover:text-gray-300">
                    History
                  </Link>
                  <Link to="/player/auctions" className="hover:text-gray-300">
                    Auctions
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/player/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/player/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;