import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PlayerLogin from "./pages/PlayerLogin";
import PlayerRegister from "./pages/PlayerRegister";
import PlayerDashboard from "./pages/PlayerDashboard";
import PlayerCollection from "./pages/PlayerCollection";
import PlayerHistory from "./pages/PlayerHistory";
import PlayerAuctions from "./pages/PlayerAuctions";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminGachas from "./pages/AdminGachas";
import Navbar from "./components/Navbar";
import CreateAuction from "./pages/CreateAuction";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Player Routes */}
        <Route path="/player/login" element={<PlayerLogin />} />
        <Route path="/player/register" element={<PlayerRegister />} />
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/player/collection" element={<PlayerCollection />} />
        <Route path="/player/history" element={<PlayerHistory />} />
        <Route path="/player/auctions" element={<PlayerAuctions />} />
        <Route path="/player/auctions/create" element={<CreateAuction />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/gachas" element={<AdminGachas />} />
      </Routes>
    </Router>
  );
}

export default App;