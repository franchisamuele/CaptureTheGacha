import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminGachas = () => {
  const [gachas, setGachas] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGacha, setCurrentGacha] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchGachas = async () => {
      try {
        const response = await axios.get("https://localhost/gachas/collection", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGachas(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || "Failed to fetch gachas.");
      }
    };
    fetchGachas();
  }, [navigate, token]);

  const handleEdit = (gacha) => {
    setCurrentGacha(gacha);
    setIsModalOpen(true);
  };

  const handleDelete = async (gachaId) => {
    try {
      await axios.delete(`https://localhost/gachas/collection/${gachaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGachas(gachas.filter((g) => g.id !== gachaId));
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to delete gacha.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gachaData = new FormData();
    gachaData.append("name", formData.get("name"));
    gachaData.append("rarity", formData.get("rarity"));
    if (formData.get("image")) {
      gachaData.append("image", formData.get("image"));
    }
  
    try {
      if (currentGacha) {
        await axios.put(`https://localhost/gachas/collection/${currentGacha.id}`, gachaData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("https://localhost/gachas/collection", gachaData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      setCurrentGacha(null);
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to save gacha.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gachas</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Gacha
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gachas.map((gacha) => (
            <div key={gacha.id} className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold">{gacha.name}</h3>
              <img
                src={"https://localhost/gachas" + gacha.image_url}
                alt={gacha.name}
                className="w-32 h-32 mx-auto my-4"
              />
              <p className="text-sm text-gray-600">Rarity: {gacha.rarity}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(gacha)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gacha.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {currentGacha ? "Edit Gacha" : "Add Gacha"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={currentGacha?.name}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <select
                name="rarity"
                defaultValue={currentGacha?.rarity}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
              <input
                type="file"
                name="image"
                className="w-full p-2 mb-4 border rounded"
                required={!currentGacha}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminGachas;