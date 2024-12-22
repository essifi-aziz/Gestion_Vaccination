import React from 'react';
import './App.css';  // This should import the CSS file where Tailwind is configured
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Vaccines from './components/Vaccines';
import Appointments from './components/Appointments';

function App() {
  return (
    <Router>
      <div className="font-sans">
        {/* Navbar */}
        <NavBar />

        {/* Main content */}
        <div className="container mx-auto px-6 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vaccines" element={<Vaccines />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
