import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateAuction = () => {
  const [gachaId, setGachaId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [expirationTimestamp, setExpirationTimestamp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Convert the expiration timestamp to Unix format (seconds since 1970)
      const expirationUnix = Math.floor(new Date(expirationTimestamp).getTime() / 1000);

      const response = await axios.post(
        "https://localhost/auctions/sell",
        {
          gacha_id: parseInt(gachaId),
          base_price: parseFloat(basePrice),
          expiration_timestamp: expirationUnix,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        navigate("/player/auctions");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to create auction.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Auction</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gacha ID</label>
            <input
              type="number"
              value={gachaId}
              onChange={(e) => setGachaId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Base Price</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <input
              type="datetime-local"
              value={expirationTimestamp}
              onChange={(e) => setExpirationTimestamp(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/player/auctions")}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;