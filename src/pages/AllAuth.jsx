import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaArrowRight, FaCheckCircle, FaBriefcase, FaChartLine, FaIdCard, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { adminLogin, adminRegister, employeeLogin, employeeRegister } from "../services/authService";
import { toast } from "react-toastify";

function AllAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    employeeId: "",
    phoneNumber: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdmin) {
        if (isLogin) {
          if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password');
            return;
          }

          if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
          }

          console.log('Attempting admin login...');
          await adminLogin(formData.email, formData.password);
          console.log('Admin login successful');
          navigate("/admin/dashboard");
        } else {
          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          await adminRegister(formData.name, formData.email, formData.password);
          navigate("/admin/dashboard");
        }
      } else {
        if (isLogin) {
          await employeeLogin(formData.email, formData.password);
          navigate("/employee/home");
        } else {
          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          await employeeRegister(formData);
          toast.success("Registration successful! Please login.");
          setIsLogin(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            department: "",
            employeeId: "",
            phoneNumber: "",
            address: ""
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaCheckCircle className="text-4xl text-blue-500" />,
      title: "Easy Access",
      description: "Quick and secure access to your documents anytime, anywhere"
    },
    {
      icon: <FaBriefcase className="text-4xl text-blue-500" />,
      title: "Document Management",
      description: "Efficiently manage all your employment documents in one place"
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      title: "Real-time Updates",
      description: "Get instant notifications for new documents and updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-12" />
          <button
            onClick={() => setShowLoginForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-800 mb-6"
          >
            Manage Your Employment Documents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Access your offer letters and salary slips with ease
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowLoginForm(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Get Started <FaArrowRight />
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl relative"
          >
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Left Side */}
            <div className="w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col items-center justify-center p-10">
              <motion.img
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={logo}
                alt="Company Logo"
                className="w-48 mb-10 drop-shadow-xl"
              />
              <h2 className="text-3xl font-bold text-center">
                {isAdmin ? "Admin Portal" : isLogin ? "Welcome Back!" : "Join Us Today"}
              </h2>
              <p className="mt-4 text-lg text-center text-blue-100">
                {isAdmin 
                  ? "Manage documents and users" 
                  : isLogin 
                    ? "Access your documents securely" 
                    : "Create your account in minutes"
                }
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="w-1/3 p-6 bg-white"> 
  <form onSubmit={handleSubmit} className="space-y-4">
    {!isAdmin && !isLogin && (
      <>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="relative">
          <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="relative">
          <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="Employee ID"
            className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="relative">
          <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </>
    )}

    <div className="relative">
      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        required
      />
    </div>

    <div className="relative">
      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        required
      />
    </div>

    {!isLogin && (
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full pl-12 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
      </div>
    )}

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {loading ? "Processing..." : isAdmin ? "Admin Sign In" : isLogin ? "Sign In" : "Sign Up"}
    </motion.button>
  </form>


              <div className="mt-6 space-y-4">
                {!isAdmin && (
                  <p className="text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                )}

                <p className="text-center text-gray-600">
                  {isAdmin ? "Not an admin?" : "Are you an admin?"}{" "}
                  <button
                    onClick={() => {
                      setIsAdmin(!isAdmin);
                      setIsLogin(true);
                    }}
                    className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                  >
                    {isAdmin ? "Employee Login" : "Admin Login"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AllAuth;
