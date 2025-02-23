import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PlayerCollection = () => {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/player/login");
      return;
    }

    const fetchCollection = async () => {
      try {
        const response = await axios.get("https://localhost/players/collection", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollection(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch collection.");
      }
    };
    fetchCollection();
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Collection</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((item, index) => (
            <GachaItem key={item.id} item={item} index={index} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GachaItem = ({ item, index, token }) => {
  const [gacha, setGacha] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGacha = async () => {
      try {
        const response = await axios.get(`https://localhost/gachas/collection/${item.gacha_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGacha(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch gacha info.");
      }
    };
    fetchGacha();
  }, [item.gacha_id, token]);

  // Define styles based on rarity
  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case "common":
        return {
          background: "linear-gradient(135deg, #f0f0f0, #d3d3d3)",
          border: "2px solid #c0c0c0",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        };
      case "rare":
        return {
          background: "linear-gradient(135deg, #b3e5fc, #81d4fa)",
          border: "2px solid #4fc3f7",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        };
      case "epic":
        return {
          background: "linear-gradient(135deg, #ce93d8, #ba68c8)",
          border: "2px solid #ab47bc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        };
      case "legendary":
        return {
          background: "linear-gradient(135deg, #ffd54f, #ffb300)",
          border: "2px solid #ffa000",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.4)",
        };
      default:
        return {
          background: "linear-gradient(135deg, #f0f0f0, #d3d3d3)",
          border: "2px solid #c0c0c0",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-6 rounded-lg shadow-md text-center"
      style={gacha ? getRarityStyle(gacha.rarity) : {}}
    >
      {gacha ? (
        <>
          <h3 className="text-xl font-bold">{gacha.name}</h3>
          <img
            src={"https://localhost/gachas" + gacha.image_url}
            alt={gacha.name}
            className="w-32 h-32 mx-auto my-4"
          />
          <p className="text-lg">Quantity: {item.quantity}</p>
          <p className="text-sm text-gray-600">Rarity: {gacha.rarity}</p>
        </>
      ) : (
        <p className="text-lg text-red-500">{error || "Loading gacha info..."}</p>
      )}
    </motion.div>
  );
};

export default PlayerCollection;