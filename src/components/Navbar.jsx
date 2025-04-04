import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeLogout } from "../services/authService";
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);

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
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-semibold text-gray-800">
            Employee Portal
          </span>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center space-x-6">
          {employeeInfo && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {employeeInfo.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{employeeInfo.name}</p>
                <p className="text-xs text-gray-500">{employeeInfo.department}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
