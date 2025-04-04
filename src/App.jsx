import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AllAuth from './pages/AllAuth'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeHome from './pages/EmployeeHome'
import HomeSalarySlip from './pages/HomeSalarySlip'
import HomeOfferLetter from './pages/HomeOfferLetter'
import AdminSalarySlip from './pages/AdminSalarySlip'
import AdminOfferLetter from './pages/AdminOfferLetter'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllAuth />} />
        {/* Add more routes as needed */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/home" element={<EmployeeHome />} />
        <Route path="/employee/salary-slip" element={<HomeSalarySlip />} />
        <Route path="/employee/offer-letter" element={<HomeOfferLetter />} />
        <Route path="/admin/salary-slip" element={<AdminSalarySlip />} />
        <Route path="/admin/offer-letter" element={<AdminOfferLetter />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App
