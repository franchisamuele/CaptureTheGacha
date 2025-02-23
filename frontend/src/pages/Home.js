import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) { // Check if token is valid
        if (decodedToken.role === "admin") {
          navigate("/admin/gachas");
        } else {
          navigate("/player/dashboard");
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("playerId");
      }
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-50 to-purple-50 pt-40">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Gacha World</h1>
        <div>
          <button
            onClick={() => navigate("/player/login")}
            className="w-64 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Player Login
          </button>
          <div className="my-4"></div>
          <button
            onClick={() => navigate("/admin/login")}
            className="w-64 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;