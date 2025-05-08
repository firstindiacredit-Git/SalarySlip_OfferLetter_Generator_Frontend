import axios from 'axios';

const API_URL = 'https://salary-slip-offer-letter-generator-backend.vercel.app/api/employees';

// Create axios instance with auth header
const getAuthHeader = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    return {
        headers: {
            Authorization: `Bearer ${adminInfo?.token}`
        }
    };
};

// Get all employees
export const getAllEmployees = async () => {
    const response = await axios.get(`${API_URL}`, getAuthHeader());
    return response.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
    const response = await axios.get(`${API_URL}/admin/employees/${id}`, getAuthHeader());
    return response.data;
};

// Add new employee
export const addEmployee = async (employeeData) => {
    const response = await axios.post(`${API_URL}`, employeeData, getAuthHeader());
    return response.data;
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
    const response = await axios.put(`${API_URL}/${id}`, employeeData, getAuthHeader());
    return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

// Apply for offer letter
export const applyForOfferLetter = async (employeeId, offerLetterData) => {
    const response = await axios.post(`${API_URL}/apply-offer-letter`, offerLetterData, getAuthHeader());
    return response.data;
};

// Update offer letter status
export const updateOfferLetterStatus = async (employeeId, status) => {
    const response = await axios.put(`${API_URL}/admin/offer-letter/${employeeId}/status`, { status }, getAuthHeader());
    return response.data;
}; 