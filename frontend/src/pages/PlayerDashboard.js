import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PlayerDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [gachaResult, setGachaResult] = useState(null);
  const [error, setError] = useState("");
  const [isRolling, setIsRolling] = useState(false); // Track rolling state
  const [animationStage, setAnimationStage] = useState(0); // Track animation stages
  const [flash, setFlash] = useState(false); // Track flash effect
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/player/login");
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await axios.get("https://localhost/players/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(response.data.balance); // Ensure the response has a "balance" field
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch balance.");
      }
    };
    fetchBalance();
  }, [navigate, token]);

  const handleRoll = async () => {
    setIsRolling(true); // Start rolling animation
    setError(""); // Clear previous errors
    setGachaResult(null); // Clear previous result
    setAnimationStage(0); // Reset animation stage
    setFlash(false); // Reset flash effect

    try {
      const response = await axios.get("https://localhost/players/roll", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const gachaId = response.data.gacha_id;

        // Fetch gacha details
        const gachaResponse = await axios.get(`https://localhost/gachas/collection/${gachaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (gachaResponse.data) {
          setGachaResult(gachaResponse.data);
          setBalance((prevBalance) => prevBalance - 500); // Deduct $500 from balance

          // Start the animation stages
          setTimeout(() => setAnimationStage(1), 500); // Show name after 0.3 seconds
          setTimeout(() => setAnimationStage(2), 1000); // Show image after 0.6 seconds
          setTimeout(() => setAnimationStage(3), 1500); // Show rarity text after 0.9 seconds
          setTimeout(() => {
            setAnimationStage(4); // Show rarity color after 1.2 seconds
            if (gachaResponse.data.rarity !== "common") {
              setFlash(true); // Trigger flash effect for non-common rarities
            }
          }, 2000);
          setTimeout(() => setFlash(false), 2350); // End flash effect after 1.5 seconds
          setTimeout(() => setIsRolling(false), 2750); // End animation after 1.8 seconds
        } else {
          setError("Invalid gacha response from the server.");
          setIsRolling(false);
        }
      } else {
        setError(response.data?.detail || "Failed to roll gacha.");
        setIsRolling(false);
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to roll gacha.");
      setIsRolling(false);
    }
  };

  const handleRecharge = async () => {
    try {
      const playerId = localStorage.getItem("playerId");
      if (!playerId) {
        setError("Player ID not found. Please log in again.");
        return;
      }

      const response = await axios.post(
        `https://localhost/players/recharge/${playerId}/100`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setBalance((prevBalance) => prevBalance + 100); // Update balance
      } else {
        setError(response.data?.detail || "Failed to recharge.");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to recharge.");
    }
  };

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

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Flash Effect */}
      <AnimatePresence>
        {flash && gachaResult?.rarity !== "common" && (
          <motion.div
            key="flash"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${getRarityStyle(gachaResult?.rarity).background}, transparent)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Particle Explosion */}
      <AnimatePresence>
        {flash && gachaResult?.rarity !== "common" && (
          <motion.div
            key="particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
          >
            {[...Array(200)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 50, opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.005, ease: "easeOut" }}
                className="w-4 h-4 rounded-full absolute"
                style={{
                  background: getRarityStyle(gachaResult?.rarity).background,
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 1.8}deg) translateY(-1000px)`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Shake */}
      <AnimatePresence>
        {flash && gachaResult?.rarity !== "common" && (
          <motion.div
            key="shake"
            initial={{ x: 0, y: 0 }}
            animate={{ x: [0, -10, 10, -10, 10, 0], y: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-30"
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <p className="text-xl">
            Balance: <span className="font-bold">${balance}</span>
          </p>
          <button
            onClick={handleRecharge}
            className="mt-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-300"
          >
            Recharge $100
          </button>
        </motion.div>
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          Roll Gacha ($500)
        </button>

        {/* Rolling Animation */}
        <AnimatePresence>
          {(isRolling || gachaResult) && (
            <motion.div
              key="rolling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center justify-center"
            >
              <motion.div
                className="w-64 h-64 rounded-lg shadow-md flex flex-col items-center justify-center text-center p-4"
                style={
                  animationStage >= 4 && gachaResult
                    ? getRarityStyle(gachaResult.rarity)
                    : { background: "linear-gradient(135deg, #f0f0f0, #d3d3d3)" }
                }
              >
                {/* Stage 1: Show Name */}
                {animationStage >= 1 && gachaResult && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold"
                  >
                    {gachaResult.name}
                  </motion.p>
                )}

                {/* Stage 2: Show Image */}
                {animationStage >= 2 && gachaResult && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={"https://localhost/gachas" + gachaResult.image_url}
                    alt={gachaResult.name}
                    className="w-32 h-32 my-4"
                  />
                )}

                {/* Stage 3: Show Rarity Text */}
                {animationStage >= 3 && gachaResult && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-gray-600"
                  >
                    Rarity: {gachaResult.rarity}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerDashboard;