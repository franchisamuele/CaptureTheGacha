import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const PlayerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://localhost/auth/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Decode the token to get the player ID and role
      const decodedToken = jwtDecode(token);
      const playerId = decodedToken.sub; // Ensure this matches the backend JWT payload
      const role = decodedToken.role;

      // Save playerId to localStorage
      localStorage.setItem("playerId", playerId);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/gachas");
        } else {
          navigate("/player/dashboard");
        }
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Player Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/player/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
        <p className="mt-4 text-center text-gray-600">
          Want to login as an admin?{" "}
          <a href="/admin/login" className="text-purple-600 hover:underline">
            Click here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default PlayerLogin;