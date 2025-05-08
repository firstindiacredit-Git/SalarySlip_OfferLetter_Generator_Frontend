import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

const AdminOfferLetter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeData = location.state?.employeeData;

  const [employee, setEmployee] = useState({
    name: employeeData?.fullName || "",
    email: employeeData?.email || "",
    position: employeeData?.department || "",
    employeeId: employeeData?.employeeId || "",
    startDate: employeeData?.startDate ? new Date(employeeData.startDate).toISOString().split('T')[0] : "",
    salary: employeeData?.expectedSalary ? employeeData.expectedSalary.toString() : "",
    hiringManager: "",
    managerTitle: "",
    message: `We are pleased to extend an offer of employment for the position of [Position] at PizeonFly. 

Based on your qualifications and experience, we would like to offer you this position with the following details:

Position: [Position]
Employee ID: [EmployeeId]
Start Date: [Start Date]
Annual Salary: [Salary]

This offer is contingent upon the successful completion of our pre-employment process.

We are excited about the prospect of having you join our team and believe you will be a valuable asset to our organization.

Please indicate your acceptance of this offer by signing below.`,
  });

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    if (!employeeData) {
      toast.error("No employee data provided");
      navigate("/admin/dashboard");
    }
  }, [employeeData, navigate]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const downloadPDF = () => {
    const input = document.getElementById("offer-letter");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
      pdf.save(`Offer_Letter_${employee.name}.pdf`);
    });
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    // Validate required fields
    if (!employee.hiringManager || !employee.managerTitle || !employee.startDate || !employee.salary) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const { token } = JSON.parse(adminInfo);
      const response = await fetch('http://localhost:5173/api/offer-letter/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          position: employee.position,
          startDate: new Date(employee.startDate).toISOString(),
          salary: parseFloat(employee.salary),
          hiringManager: employee.hiringManager,
          managerTitle: employee.managerTitle,
          message: employee.message.replace(/\[Position\]/g, employee.position)
            .replace("[Start Date]", formatDate(employee.startDate))
            .replace("[EmployeeId]", employee.employeeId)
            .replace("[Salary]", `₹${parseInt(employee.salary).toLocaleString()}`)
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit offer letter');
      }

      const data = await response.json();
      toast.success(data.message || 'Offer letter submitted successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error submitting offer letter:', error);
      toast.error(error.message || 'Failed to submit offer letter');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Generate Offer Letter</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={employee.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="text" name="email" value={employee.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input type="text" name="position" value={employee.position} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input type="text" name="employeeId" value={employee.employeeId} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={employee.startDate} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md p-2" 
                />
                {employeeData?.startDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current Start Date: {new Date(employeeData.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary (₹)</label>
                <input 
                  type="text" 
                  name="salary" 
                  value={employee.salary} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  placeholder="Enter Annual Salary" 
                />
                {employeeData?.expectedSalary && (
                  <p className="text-sm text-gray-500 mt-1">
                    Expected: ₹{employeeData.expectedSalary.toLocaleString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager</label>
                <input type="text" name="hiringManager" value={employee.hiringManager} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter Hiring Manager Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Title</label>
                <input type="text" name="managerTitle" value={employee.managerTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter Manager Title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Letter Content</label>
                <textarea 
                  name="message" 
                  value={employee.message} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md p-2 h-48" 
                  placeholder="Enter offer letter content"
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div id="offer-letter" className="bg-white p-8 rounded-lg mb-6">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <img src={logo} alt="Company Logo" className="w-36 h-auto" />
                <div className="text-sm text-gray-600 font-medium">{formatDate(new Date())}</div>
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Offer of Employment</h2>
              <p className="mb-4 text-gray-700 font-medium">Dear {employee.name},</p>
              <p className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                {employee.message
                  .replace(/\[Position\]/g, employee.position)
                  .replace("[Start Date]", employee.startDate ? formatDate(employee.startDate) : "[Start Date]")
                  .replace("[EmployeeId]", employee.employeeId)
                  .replace("[Salary]", employee.salary ? `₹${parseInt(employee.salary).toLocaleString()}` : "[Salary]")}
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-800">Sincerely,</p>
                <p className="text-gray-700 font-medium">{employee.hiringManager || "[Hiring Manager Name]"}</p>
                <p className="text-gray-500 text-sm italic">{employee.managerTitle || "[Title]"}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit Offer Letter
              </button>
              <button
                onClick={downloadPDF}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOfferLetter;
