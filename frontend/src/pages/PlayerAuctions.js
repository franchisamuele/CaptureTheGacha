import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PlayerAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/player/login");
      return;
    }

    const fetchAuctions = async () => {
      try {
        const response = await axios.get("https://localhost/auctions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch auctions.");
      }
    };
    fetchAuctions();
  }, [navigate, token]);

  // Function to format remaining time
  const formatRemainingTime = (expirationTimestamp) => {
    const now = Math.floor(Date.now() / 1000); // Current time in Unix seconds
    const remainingSeconds = expirationTimestamp - now;

    if (remainingSeconds <= 0) return "Expired";

    const days = Math.floor(remainingSeconds / (60 * 60 * 24));
    const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
    const seconds = remainingSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-left">Auctions</h1>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-4xl text-gray-600">🚧 Work in progress... 🚧</p>
        </div>
      </div>
    </div>
  );

  // TODO: Real implementation
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Auctions</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          {auctions.map((auction) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <p className="text-lg">Gacha ID: {auction.gacha_id}</p>
              <p className="text-sm text-gray-600">Base Price: ${auction.base_price}</p>
              <p className="text-sm text-gray-600">Highest Bid: ${auction.highest_bid}</p>
              <p className="text-sm text-gray-600">Time Remaining: {formatRemainingTime(auction.expiration_timestamp)}</p>
              <button
                onClick={() => navigate(`/player/auctions/bid/${auction.id}`)}
                className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
              >
                Place Bid
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerAuctions;