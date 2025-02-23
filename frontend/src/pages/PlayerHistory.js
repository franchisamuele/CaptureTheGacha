import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PlayerHistory = () => {
  const [rollHistory, setRollHistory] = useState([]);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/player/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const [rollsResponse, rechargesResponse, auctionsResponse] = await Promise.all([
          axios.get("https://localhost/players/rolls", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://localhost/players/recharges", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://localhost/auctions/personal", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sortedRolls = rollsResponse.data.sort((a, b) => b.timestamp - a.timestamp);
        const sortedRecharges = rechargesResponse.data.sort((a, b) => b.timestamp - a.timestamp);
        const sortedAuctions = auctionsResponse.data.sort((a, b) => b.expiration_timestamp - a.expiration_timestamp);

        setRollHistory(sortedRolls);
        setRechargeHistory(sortedRecharges);
        setAuctionHistory(sortedAuctions);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch history.");
      }
    };
    fetchHistory();
  }, [navigate, token]);

  // Function to convert Unix timestamp to Italian date format (dd/mm/yyyy)
  const formatDate = (unixTimestamp) => {
    if (!unixTimestamp) return "N/A";
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">History</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roll History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Roll History</h2>
            <div className="space-y-4">
              {rollHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-b pb-4"
                >
                  <p className="text-lg">Gacha ID: {item.gacha_id}</p>
                  <p className="text-sm text-gray-600">Paid: ${item.paid_price}</p>
                  <p className="text-sm text-gray-600">Date: {formatDate(item.timestamp)}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recharge History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Recharge History</h2>
            <div className="space-y-4">
              {rechargeHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-b pb-4"
                >
                  <p className="text-lg">Amount: ${item.amount}</p>
                  <p className="text-sm text-gray-600">Date: {formatDate(item.timestamp)}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Auction History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Auction History</h2>
            <div className="space-y-4">
              {auctionHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-b pb-4"
                >
                  <p className="text-lg">Gacha ID: {item.gacha_id}</p>
                  <p className="text-sm text-gray-600">Base Price: ${item.base_price}</p>
                  <p className="text-sm text-gray-600">Highest Bid: ${item.highest_bid}</p>
                  <p className="text-sm text-gray-600">Date: {formatDate(item.expiration_timestamp)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHistory;