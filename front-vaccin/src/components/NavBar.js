import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-2xl font-semibold text-gray-900">Vaccination</h1>

        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/vaccines"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Vaccines
          </Link>
          <Link
            to="/appointments"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Appointments
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/vaccines"
            className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Vaccines
          </Link>
          <Link
            to="/appointments"
            className="block text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Appointments
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
