import React from "react";
import logo from "../assets/logo.png";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info Section */}
          <div className="flex flex-col">
            <img src={logo} alt="Pizeonfly Logo" className="w-40 h-auto mb-6" />
            <p className="text-gray-300 mb-4 leading-relaxed">
              Pizeonfly is a leading provider of innovative digital solutions for businesses of all sizes, helping them transform their digital presence.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition duration-300">
                <FaFacebookF className="text-white" />
              </a>
              <a href="#" className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full transition duration-300">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition duration-300">
                <FaLinkedinIn className="text-white" />
              </a>
              <a href="#" className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 p-2 rounded-full transition duration-300">
                <FaInstagram className="text-white" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Website Development</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Digital Marketing</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Google Ads</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Email Marketing</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Content Writing</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Mobile App Development</a></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-blue-400 transition duration-300"><a href="#">About Us</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Privacy Policy</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Terms of Use</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Refund Policy</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Contact Us</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Careers</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-blue-400 text-lg mt-1 flex-shrink-0" />
                <p className="text-gray-300">88, Sant Nagar, Near India Post Office, East of Kailash, New Delhi 110065, INDIA</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">+91 9015-6627-28</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">+91 9675-9675-09</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">info@pizeonfly.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>
        
        {/* Bottom Section with Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>Copyright © {currentYear} Pizeonfly | All Rights Reserved</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Privacy</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Terms</a></li>
              <li className="hover:text-blue-400 transition duration-300"><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
