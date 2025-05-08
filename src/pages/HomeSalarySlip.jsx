import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomeSalarySlip = () => {
  const navigate = useNavigate();
  const [salarySlip, setSalarySlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    month: "",
    year: "",
    department: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
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

    fetchSalarySlip();
  }, [navigate]);

  const fetchSalarySlip = async () => {
    try {
      const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo'));
      
      // Check if employeeInfo and token exist
      if (!employeeInfo || !employeeInfo.token) {
        toast.error("Authentication failed. Please login again.");
        localStorage.removeItem('employeeInfo');
        navigate('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:5173/api/salary-slips/employee/${employeeInfo.employeeId}`, {
        headers: {
          'Authorization': `Bearer ${employeeInfo.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('employeeInfo');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setSalarySlip(data.data[0]); // Get the most recent salary slip
        }
      } else {
        console.error('Failed to fetch salary slip:', response.status);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate net salary
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;
    
    try {
      const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo'));
      const response = await fetch("http://localhost:5173/api/employees/salary-slip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${employeeInfo.token}`
        },
        body: JSON.stringify({
          employeeName: formData.fullName,
          employeeId: employeeInfo.employeeId,
          department: formData.department,
          month: formData.month,
          year: formData.year,
          basicSalary: parseFloat(formData.basicSalary),
          allowances: parseFloat(formData.allowances) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          netSalary: netSalary
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Salary slip request submitted successfully!");
        navigate('/employee/home');
      } else {
        toast.error(data.message || "Failed to submit salary slip request");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById("salary-slip");
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save(`Salary_Slip_${salarySlip.employeeName}_${salarySlip.month}_${salarySlip.year}.pdf`);
      
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
          {salarySlip ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Your Salary Slip
              </h1>
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div id="salary-slip" className="bg-white p-8 rounded-xl border-2 border-gray-200">
                  {/* Header Section */}
                  <div className="text-center border-b-2 border-gray-200 pb-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <img src={logo} alt="Company Logo" className="w-40 h-auto" />
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-full inline-block">
                          {salarySlip.month} {salarySlip.year}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Generated on: {formatDate(new Date())}</p>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Salary Statement</h2>
                  </div>

                  {/* Employee Details Section */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Employee Name</h3>
                        <p className="text-lg font-semibold text-gray-800">{salarySlip.employeeName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Employee ID</h3>
                        <p className="text-lg font-semibold text-gray-800">{salarySlip.employeeId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                        <p className="text-lg font-semibold text-gray-800">{salarySlip.department}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Pay Period</h3>
                        <p className="text-lg font-semibold text-gray-800">{salarySlip.month} {salarySlip.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Details Section */}
                  <div className="mb-8">
                    <div className="grid grid-cols-12 gap-4 bg-gray-100 p-4 rounded-t-xl font-semibold text-gray-700">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-3 text-right">Earnings</div>
                      <div className="col-span-3 text-right">Deductions</div>
                    </div>
                    
                    <div className="border-x border-gray-200">
                      {/* Basic Salary */}
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                        <div className="col-span-6 text-gray-700">Basic Salary</div>
                        <div className="col-span-3 text-right text-gray-800 font-medium">
                          ₹{parseInt(salarySlip.basicSalary).toLocaleString()}
                        </div>
                        <div className="col-span-3"></div>
                      </div>

                      {/* Allowances */}
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                        <div className="col-span-6 text-gray-700">Allowances</div>
                        <div className="col-span-3 text-right text-green-600 font-medium">
                          ₹{parseInt(salarySlip.allowances || 0).toLocaleString()}
                        </div>
                        <div className="col-span-3"></div>
                      </div>

                      {/* Deductions */}
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center">
                        <div className="col-span-6 text-gray-700">Deductions</div>
                        <div className="col-span-3"></div>
                        <div className="col-span-3 text-right text-red-600 font-medium">
                          ₹{parseInt(salarySlip.deductions || 0).toLocaleString()}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 items-center font-bold text-gray-800">
                        <div className="col-span-6">Total</div>
                        <div className="col-span-3 text-right border-t border-gray-300 pt-2">
                          ₹{(parseInt(salarySlip.basicSalary) + parseInt(salarySlip.allowances || 0)).toLocaleString()}
                        </div>
                        <div className="col-span-3 text-right border-t border-gray-300 pt-2">
                          ₹{parseInt(salarySlip.deductions || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Net Salary */}
                    <div className="bg-blue-50 p-6 rounded-b-xl border-x border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Net Salary</h3>
                          <p className="text-sm text-gray-600 mt-1">Amount payable for {salarySlip.month} {salarySlip.year}</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{parseInt(salarySlip.netSalary).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
                    <p>This is a computer-generated salary slip and does not require a signature.</p>
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
                Apply for Salary Slip
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
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    disabled
                    className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      min="2020"
                      max="2030"
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.basicSalary}
                      onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowances
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.allowances}
                      onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deductions
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-xl p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                      value={formData.deductions}
                      onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You for Downloading!</h2>
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

export default HomeSalarySlip;
