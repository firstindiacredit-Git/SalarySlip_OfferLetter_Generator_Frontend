import { useState, useEffect } from 'react';
import { FaUsers, FaSignOutAlt, FaTachometerAlt, FaUserPlus, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { adminLogout, getStoredUserInfo } from '../services/authService';
import { getAllEmployees, addEmployee, deleteEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    employeeId: '',
    startDate: '',
    expectedSalary: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = getStoredUserInfo('admin');
    if (!adminInfo || !adminInfo.token) {
      navigate('/');
      return;
    }
    fetchEmployees();
  }, [navigate]);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
      console.log(data, "data");
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401) {
        adminLogout();
        navigate('/');
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addEmployee(formData);
      toast.success('Employee added successfully');
      setFormData({
        name: '',
        email: '',
        department: '',
        employeeId: '',
        startDate: '',
        expectedSalary: ''
      });
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      if (error.response?.status === 401) {
        adminLogout();
        navigate('/');
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        await deleteEmployee(id);
        toast.success('Employee deleted successfully');
        fetchEmployees(); // Refresh the employee list
      } catch (error) {
        if (error.response?.status === 401) {
          adminLogout();
          navigate('/');
          return;
        }
        toast.error(error.response?.data?.message || 'Failed to delete employee');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApplyOfferLetter = (employee) => {
    const adminInfo = getStoredUserInfo('admin');
    if (!adminInfo || !adminInfo.token) {
      navigate('/');
      return;
    }
    navigate('/admin/offer-letter', { 
      state: { 
        employeeData: {
          fullName: employee.name,
          department: employee.department,
          employeeId: employee.employeeId,
          email: employee.email,
          startDate: employee.startDate,
          expectedSalary: employee.expectedSalary
        }
      }
    });
  };

  const handleApplySalarySlip = (employee) => {
    const adminInfo = getStoredUserInfo('admin');
    if (!adminInfo || !adminInfo.token) {
      navigate('/');
      return;
    }
    
    // Get the most recent salary slip if it exists
    const latestSalarySlip = employee.salarySlips && employee.salarySlips.length > 0 
      ? employee.salarySlips[employee.salarySlips.length - 1] 
      : null;

    navigate('/admin/salary-slip', { 
      state: { 
        employeeData: {
          name: employee.name,
          department: employee.department,
          employeeId: employee.employeeId,
          designation: employee.jobTitle || employee.designation,
          salarySlips: latestSalarySlip || {
            basicSalary: "",
            hra: "",
            allowances: "",
            netSalary: "",
            month: "",
            year: new Date().getFullYear()
          }
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white">
        <div className="p-6 border-b border-blue-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-blue-200 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <nav className="mt-6 px-4">
          <div
            className={`mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === 'dashboard' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-700/50'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center space-x-3">
              <FaTachometerAlt className="text-xl" />
              <span>Dashboard</span>
            </div>
          </div>
          <div
            className={`mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === 'employees' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-700/50'
            }`}
            onClick={() => setActiveTab('employees')}
          >
            <div className="flex items-center space-x-3">
              <FaUsers className="text-xl" />
              <span>Employees</span>
            </div>
          </div>
          <div
            className={`mb-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === 'add-employee' ? 'bg-blue-700 shadow-lg' : 'hover:bg-blue-700/50'
            }`}
            onClick={() => setActiveTab('add-employee')}
          >
            <div className="flex items-center space-x-3">
              <FaUserPlus className="text-xl" />
              <span>Add Employee</span>
            </div>
          </div>
          <div
            className="mt-auto p-3 rounded-lg cursor-pointer hover:bg-red-600/50 transition-all duration-200"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-3">
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'employees' && 'Employee Management'}
              {activeTab === 'add-employee' && 'Add New Employee'}
            </h1>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <FaUsers className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
                    <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <FaFileAlt className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Offer Letters</h2>
                    <p className="text-3xl font-bold text-green-600">{employees.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-4 bg-purple-100 rounded-full">
                    <FaMoneyBillWave className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-700">Salary Slips</h2>
                    <p className="text-3xl font-bold text-purple-600">{employees.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee List */}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expected Salary</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{employee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {employee.startDate ? new Date(employee.startDate).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {employee.expectedSalary ? `₹${employee.expectedSalary.toLocaleString()}` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApplyOfferLetter(employee)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                              Offer Letter
                            </button>
                            <button
                              onClick={() => handleApplySalarySlip(employee)}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                            >
                              Salary Slip
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee._id)}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Employee Form */}
          {activeTab === 'add-employee' && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <form onSubmit={handleAddEmployee} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary (₹)</label>
                    <input
                      type="number"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter amount in rupees"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Adding...' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

