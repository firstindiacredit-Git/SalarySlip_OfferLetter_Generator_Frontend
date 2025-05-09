import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-200">
      
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800 drop-shadow-lg">
            Welcome to Employee Portal
          </h1>
          <p className="text-lg mb-8 text-gray-700 opacity-90">
            Manage your employment documents easily. Apply for an offer letter
            or download your salary slip with just one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Apply Offer Letter Button */}
            <Link
              to="/employee/offer-letter"
              className="px-6 py-3 bg-green-500 text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Apply for Offer Letter
            </Link>

            {/* Download Salary Slip Button */}
            <Link
              to="/employee/salary-slip"
              className="px-6 py-3 bg-purple-500 text-lg font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-transform transform hover:scale-105"
            >
               Apply for Salary Slip
            </Link>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default MainContent;