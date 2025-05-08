import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomeOfferLetter = () => {
  const navigate = useNavigate();
  const [offerLetter, setOfferLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    department: "",
    startDate: "",
    salary: "",
  });

  useEffect(() => {
    const employeeInfo = localStorage.getItem('employeeInfo');
    if (!employeeInfo) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(employeeInfo);
    setFormData(prev => ({
      ...prev,
      fullName: parsed.name,
      department: parsed.department
    }));

    fetchOfferLetter();
  }, [navigate]);

  const fetchOfferLetter = async () => {
    try {
      const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo'));
      const response = await fetch(`http://localhost:5173/api/offer-letter/${employeeInfo.employeeId}`, {
        headers: {
          'Authorization': `Bearer ${employeeInfo.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOfferLetter(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offer letter:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo'));
      const response = await fetch("http://localhost:5173/api/employees/apply-offer-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employeeInfo.token}`
        },
        body: JSON.stringify({
          ...formData,
          employeeId: employeeInfo.employeeId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Offer letter application submitted successfully!");
        navigate('/employee/home');
      } else {
        toast.error(data.message || "Failed to submit offer letter");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById("offer-letter");
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save(`Offer_Letter_${offerLetter.name}.pdf`);
      
      // Show thank you popup after successful download
      setShowThankYou(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleThankYouClick = () => {
    setShowThankYou(false);
    navigate('/employee/home');
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {offerLetter ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Your Offer Letter
              </h1>
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div id="offer-letter" className="bg-white p-8 rounded-xl">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
                    <img src={logo} alt="Company Logo" className="w-40 h-auto" />
                    <div className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                      {formatDate(offerLetter.generatedDate)}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Offer of Employment</h2>
                  <p className="mb-6 text-lg text-gray-700 font-medium">Dear {offerLetter.name},</p>

                  <div className="space-y-6 text-gray-600">
                    <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-700">Position</p>
                        <p className="text-lg">{offerLetter.position}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-700">Employee ID</p>
                        <p className="text-lg">{offerLetter.employeeId}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-700">Start Date</p>
                        <p className="text-lg">{formatDate(offerLetter.startDate)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-700">Annual Salary</p>
                        <p className="text-lg text-blue-600 font-semibold">₹{parseInt(offerLetter.salary).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl leading-relaxed">
                      <p className="whitespace-pre-wrap text-gray-700 leading-loose text-lg">
                        {offerLetter.message}
                      </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100">
                      <p className="font-semibold text-gray-800 mb-2">Best regards,</p>
                      <p className="text-lg text-gray-700">{offerLetter.hiringManager}</p>
                      <p className="text-gray-600 italic">{offerLetter.managerTitle}</p>
                    </div>

                    {/* Computer Generated Statement */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-500 italic">
                        This is a computer-generated offer letter and does not require a signature.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={downloadPDF}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl 
                    hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Apply for Offer Letter
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    disabled
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    disabled
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold 
                  rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Thank you popup */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-6xl mb-4 animate-bounce">😊</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You for Visiting!</h2>
            <button
              onClick={handleThankYouClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl
              hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeOfferLetter;
