import axios from 'axios';

const API_URL = 'https://salary-slip-offer-letter-generator-frontend.vercel.app/api/auth';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Admin Authentication
export const adminLogin = async (email, password) => {
    try {
        // Add debug logs
        console.log('Login attempt details:', { 
            email,
            passwordLength: password?.length,
            timestamp: new Date().toISOString()
        });

        const response = await axios.post(`${API_URL}/admin/login`, 
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data) {
            console.log('Login successful:', { email });
            localStorage.setItem('adminInfo', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.error('Login failed:', {
            email,
            errorMessage: error.response?.data?.message,
            statusCode: error.response?.status
        });
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const adminRegister = async (name, email, password) => {
    try {
        console.log('Attempting admin registration with:', { name, email }); // Debug log
        const response = await axiosInstance.post('/admin/register', { name, email, password });
        console.log('Registration response:', response.data); // Debug log
        
        if (response.data) {
            localStorage.setItem('adminInfo', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.error('Admin registration error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Error setting up the request: ' + error.message);
        }
    }
};

export const adminLogout = () => {
    localStorage.removeItem('adminInfo');
};

// Employee Authentication
export const employeeLogin = async (email, password) => {
    try {
        const response = await axiosInstance.post('/employee/login', { email, password });
        if (response.data) {
            localStorage.setItem('employeeInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Employee login error:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Error setting up the request: ' + error.message);
        }
    }
};

export const employeeRegister = async (userData) => {
    try {
        const response = await axiosInstance.post('/employee/register', userData);
        if (response.data) {
            localStorage.setItem('employeeInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Employee registration error:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error('Error setting up the request: ' + error.message);
        }
    }
};

export const employeeLogout = () => {
    localStorage.removeItem('employeeInfo');
};

// Get stored user info
export const getStoredUserInfo = (type) => {
    const key = `${type}Info`;
    const userStr = localStorage.getItem(key);
    return userStr ? JSON.parse(userStr) : null;
}; 