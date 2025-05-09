import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeLogout } from "../services/authService";
import logo from '../assets/logo.png';
import { FaSignOutAlt, FaUser, FaBriefcase } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem('employeeInfo');
    if (info) {
      setEmployeeInfo(JSON.parse(info));
    }
  }, []);

  const handleLogout = () => {
    employeeLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg py-2 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-gray-800">
            Employee Portal
          </span>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center space-x-4">
          {employeeInfo && (
            <div className="relative">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-50 py-1.5 px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-medium text-sm">
                    {employeeInfo.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left pr-1">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{employeeInfo.name}</p>
                  <p className="text-xs text-gray-500 flex items-center leading-tight">
                    <FaBriefcase className="mr-1 text-blue-500" size={8} />
                    {employeeInfo.department}
                  </p>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{employeeInfo.name}</p>
                  </div>
                  <a href="#" className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <FaUser className="mr-2 text-blue-500" size={14} />
                    My Profile
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left block px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium"
                  >
                    <FaSignOutAlt className="mr-2" size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Separate Logout Button (visible only on medium+ screens) */}
          <button 
            onClick={handleLogout} 
            className="hidden md:flex px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 items-center space-x-1.5 shadow-md"
          >
            <FaSignOutAlt className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
