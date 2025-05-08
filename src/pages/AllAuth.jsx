import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaArrowRight, FaCheckCircle, FaBriefcase, FaChartLine, FaIdCard, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { adminLogin, adminRegister, employeeLogin, employeeRegister } from "../services/authService";
import { toast } from "react-toastify";

// Add CSS for animations
import './styles.css'; // Ensure this file exists or inline the styles

function AllAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Handle scroll events for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      icon: <FaCheckCircle className="text-4xl" />,
      title: "Secure Document Storage",
      description: "All your important documents are encrypted and stored securely with enterprise-level security protocols."
    },
    {
      icon: <FaBriefcase className="text-4xl" />,
      title: "Streamlined Management",
      description: "Administrative tools that make document generation, distribution and tracking incredibly simple and efficient."
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Instant Notifications",
      description: "Get real-time alerts when new documents are available or when action is required from your side."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'} mr-3`} />
            <div className="hidden md:block">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Document Portal</h3>
              <p className="text-xs text-gray-500">Secure Document Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Contact</a>
            </div>
            
            <button
              onClick={() => setShowLoginForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition duration-300 flex items-center"
            >
              <FaUser className="mr-2" /> Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-0"></div>
        
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700 leading-tight">
              Document Management <br />Made Simple
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
              Securely access your employment documents, offer letters, 
              and salary slips in one centralized platform.
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLoginForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
              >
                Get Started <FaArrowRight />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="#features"
                className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600">100%</h3>
              <p className="text-gray-600 mt-2">Secure Access</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-purple-600">24/7</h3>
              <p className="text-gray-600 mt-2">Availability</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-indigo-600">Easy</h3>
              <p className="text-gray-600 mt-2">Document Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">Features</span>
            <h2 className="text-4xl font-extrabold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Designed to make document management effortless and secure for both employees and administrators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="bg-blue-100/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  <span>Learn more</span>
                  <FaArrowRight className="ml-2 text-sm" />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional Feature Highlight */}
          <div className="mt-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Seamless Document Access</h3>
              <p className="text-gray-700 mb-8 text-lg">
                Access all your important employment documents in one place. 
                From offer letters to salary slips, everything you need is just a few clicks away.
              </p>
              <ul className="space-y-4">
                {['Instant document downloads', 'Secure cloud storage', 'Mobile-friendly access'].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="bg-blue-500/20 p-1 rounded-full mr-3">
                      <FaCheckCircle className="text-blue-600" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-500">Document Portal</div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-white rounded flex items-center px-3 text-sm text-gray-600">Offer Letter - John Doe.pdf</div>
                  <div className="h-8 bg-white rounded flex items-center px-3 text-sm text-gray-600">Salary Slip - March 2024.pdf</div>
                  <div className="h-8 bg-white rounded flex items-center px-3 text-sm text-gray-600">Contract Agreement.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl relative"
          >
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center z-10"
            >
              ✕
            </button>

            {/* Left Side - only visible on medium and larger screens */}
            <div className="hidden md:flex w-5/12 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col items-center justify-center p-10 relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-32 -right-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              </div>
              
              <div className="relative z-10 w-full">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <img 
                    src={logo} 
                    alt="Company Logo" 
                    className="w-32 mb-8 drop-shadow-xl" 
                  />
                  <h2 className="text-3xl font-bold text-center mb-4">
                    {isAdmin 
                      ? "Admin Portal" 
                      : isLogin 
                        ? "Welcome Back!" 
                        : "Join Us Today"}
                  </h2>
                  
                  <div className="w-20 h-1 bg-white/50 rounded-full mb-6"></div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-lg text-center text-blue-100 mb-8">
                    {isAdmin 
                      ? "Manage documents and control access with powerful admin tools" 
                      : isLogin 
                        ? "Access your secure documents and information in one place" 
                        : "Create your account to access employment documents and more"
                    }
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8 border border-white/20">
                    {isAdmin ? (
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Secure Admin Access</p>
                          <p className="text-sm text-blue-100">Enhanced security protocols for admin users</p>
                        </div>
                      </div>
                    ) : isLogin ? (
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Document Security</p>
                          <p className="text-sm text-blue-100">Your documents are encrypted and secured</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Easy Registration</p>
                          <p className="text-sm text-blue-100">Simple process to create your account</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isAdmin && !isLogin && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Your data is always private and secured</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 p-6 md:p-10 bg-white max-h-[80vh] overflow-y-auto">
              {/* Mobile header - only visible on small screens */}
              <div className="flex md:hidden items-center justify-center mb-6">
                <img src={logo} alt="Company Logo" className="w-24 h-auto" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                {isAdmin 
                  ? "Admin Authentication" 
                  : isLogin 
                    ? "Sign in to your account" 
                    : "Create a new account"
                }
              </h3>
  
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
                        className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="Department"
                          className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                          className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                          className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
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
                    className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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
                      className="w-full pl-12 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "Processing..." : isAdmin ? "Admin Sign In" : isLogin ? "Sign In" : "Sign Up"}
                </motion.button>
              </form>

              <div className="mt-8 space-y-4">
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
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Logo" className="h-10 mr-3" />
                <h3 className="text-xl font-bold">Document Portal</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Secure document management for businesses and employees.
                Access and manage all your important documents in one place.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@documentportal.com
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.435.74a1 1 0 01.836.986V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Business Street, Techville
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Document Portal. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AllAuth;
