import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { getStoredUserInfo } from "../services/authService";

const AdminSalarySlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeData = location.state?.employeeData;

  const [salaryDetails, setSalaryDetails] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    month: "",
    year: new Date().getFullYear(),
    basicSalary: "",
    hra: "",
    allowances: "",
    deductions: "",
    netSalary: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = getStoredUserInfo('admin');
    if (!adminInfo || !adminInfo.token) {
      navigate('/');
      return;
    }

    if (employeeData) {
      console.log('Employee Data:', employeeData); // Debug log
      setSalaryDetails(prev => ({
        ...prev,
        employeeName: employeeData.name || "",
        employeeId: employeeData.employeeId || "",
        designation: employeeData.designation || employeeData.jobTitle || "",
        department: employeeData.department || "",
        basicSalary: employeeData.salarySlips?.basicSalary || "",
        hra: employeeData.salarySlips?.hra || "",
        allowances: employeeData.salarySlips?.allowances || "",
        netSalary: employeeData.salarySlips?.netSalary || "",
        month: employeeData.salarySlips?.month || "",
        year: employeeData.salarySlips?.year || new Date().getFullYear()
      }));
    } else {
      navigate('/admin/dashboard');
      toast.error('No employee data found');
    }
  }, [employeeData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryDetails((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Calculate net salary
      const basic = parseFloat(updated.basicSalary) || 0;
      const hra = parseFloat(updated.hra) || 0;
      const allowances = parseFloat(updated.allowances) || 0;
      const deductions = parseFloat(updated.deductions) || 0;
      
      updated.netSalary = basic + hra + allowances - deductions;
      
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const adminInfo = getStoredUserInfo('admin');
      if (!adminInfo || !adminInfo.token) {
        navigate('/');
        return;
      }

      // Validate required fields
      if (!salaryDetails.employeeId || !salaryDetails.employeeName || !salaryDetails.designation || 
          !salaryDetails.department || !salaryDetails.month || !salaryDetails.year || !salaryDetails.basicSalary) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Prepare the data with all required fields
      const salaryData = {
        employeeName: salaryDetails.employeeName,
        employeeId: salaryDetails.employeeId,
        designation: salaryDetails.designation,
        department: salaryDetails.department,
        month: salaryDetails.month,
        year: parseInt(salaryDetails.year),
        basicSalary: parseFloat(salaryDetails.basicSalary),
        hra: parseFloat(salaryDetails.hra) || 0,
        allowances: parseFloat(salaryDetails.allowances) || 0,
        deductions: parseFloat(salaryDetails.deductions) || 0,
        netSalary: parseFloat(salaryDetails.netSalary)
      };

      console.log('Submitting salary data:', salaryData); // Debug log

      const response = await axios.post(
        'https://salary-slip-offer-letter-generator-frontend.vercel.app/api/salary-slips',
        salaryData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminInfo.token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Salary slip saved successfully');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to save salary slip');
      }
    } catch (error) {
      console.error('Error saving salary slip:', error);
      if (error.response?.status === 401) {
        navigate('/');
        return;
      }
      toast.error(error.response?.data?.message || 'Error saving salary slip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById("salary-slip");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save("Salary_Slip.pdf");
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d instanceof Date && !isNaN(d) 
      ? d.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Salary Slip Generator
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Salary Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  name="employeeName"
                  value={salaryDetails.employeeName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Employee Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={salaryDetails.employeeId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={salaryDetails.designation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Designation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={salaryDetails.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Department"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    name="month"
                    value={salaryDetails.month}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Month</option>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={salaryDetails.year}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Year"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                <input
                  type="number"
                  name="basicSalary"
                  value={salaryDetails.basicSalary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                <input
                  type="number"
                  name="hra"
                  value={salaryDetails.hra}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                <input
                  type="number"
                  name="allowances"
                  value={salaryDetails.allowances}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                <input
                  type="number"
                  name="deductions"
                  value={salaryDetails.deductions}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div id="salary-slip" className="bg-white p-8 rounded-lg">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <img src={logo} alt="Company Logo" className="w-36 h-auto" />
                <div className="text-sm text-gray-600 font-medium">
                  {salaryDetails.month} {salaryDetails.year}
                </div>
              </div>

              {/* Employee Details Section */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee Name</p>
                    <p className="font-semibold text-gray-800">{salaryDetails.employeeName || "---"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-semibold text-gray-800">{salaryDetails.employeeId || "---"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-semibold text-gray-800">{salaryDetails.designation || "---"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-800">{salaryDetails.department || "---"}</p>
                  </div>
                </div>
              </div>

              {/* Salary Details Table */}
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Description</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Basic Salary</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">₹ {salaryDetails.basicSalary || "0"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">HRA</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">₹ {salaryDetails.hra || "0"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Allowances</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">₹ {salaryDetails.allowances || "0"}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Deductions</td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">- ₹ {salaryDetails.deductions || "0"}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-4 py-3 font-semibold text-blue-800">Net Salary</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-800">₹ {
                        (Number(salaryDetails.basicSalary || 0) +
                        Number(salaryDetails.hra || 0) +
                        Number(salaryDetails.allowances || 0) -
                        Number(salaryDetails.deductions || 0)).toFixed(2)
                      }</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>contact@gigglingplatypus.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>123 Business Avenue, Tech City, TC 12345</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 ease-in-out shadow-lg"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Submit Salary Slip'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalarySlip;
