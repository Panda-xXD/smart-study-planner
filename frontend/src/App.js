import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subject from "./pages/Subject";
import Planner from "./pages/Planner";
import BackgroundPaths from "./components/BackgroundPaths";
import ThermodynamicGrid from "./components/ThermodynamicGrid";

function App() {
  return (
    <Router>
      {/* BACKGROUND WRAPPER */}
      <div className="background-wrapper">
        <BackgroundPaths />
        <ThermodynamicGrid resolution={20} coolingFactor={0.8} />
      </div>

      {/* CONTENT LAYER */}
      <div className="app-layer">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subject/:name" element={<Subject />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
