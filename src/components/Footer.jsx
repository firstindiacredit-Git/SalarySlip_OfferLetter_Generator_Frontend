import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Logo Section - Aligned Left */}
        <div className="flex justify-start mb-6">
          <img src={logo} alt="Company Logo" className="w-32 h-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <p>88, Sant Nagar, Near India Post Office</p>
            <p>East of Kailash, New Delhi 110065, INDIA</p>
            <p className="mt-2">📞 +91 9015-6627-28</p>
            <p>📞 +91 9675-9675-09</p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Services</h3>
            <ul className="space-y-1">
              <li>Website Development</li>
              <li>Digital Marketing Training</li>
              <li>Google Ads</li>
              <li>Email Marketing</li>
              <li>Content Writing</li>
              <li>Graphic Designing</li>
              <li>Mobile App Development</li>
              <li>Online Reputation Management</li>
              <li>Search Engine Optimization</li>
              <li>SMM & Account Management</li>
              <li>Video & Animations</li>
            </ul>
          </div>

          {/* Website Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Website</h3>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Refund Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p>Copyright © 2025 Pizeonfly | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
