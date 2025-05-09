import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MainContent from '../components/MainContent'
import { FaChartLine, FaCalendarAlt, FaFileAlt, FaUserFriends } from 'react-icons/fa'

const EmployeeHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Your Workspace</h1>
              <p className="text-xl opacity-90 mb-8">Manage your tasks, track your performance, and grow with us.</p>
              <button className="bg-white text-indigo-700 hover:bg-opacity-90 font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1">
                Explore Dashboard
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl shadow-2xl">
                <div className="relative overflow-hidden rounded-lg w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 mix-blend-overlay"></div>
                  <img 
                    src="https://img.freepik.com/free-vector/employee-working-office-interior-workplace-flat-vector-illustration_1150-37459.jpg" 
                    alt="Workspace Illustration" 
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Everything You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-blue-600 mb-4">
                <FaChartLine className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Performance Tracking</h3>
              <p className="text-gray-600">Monitor your key metrics and track your growth over time.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-indigo-600 mb-4">
                <FaCalendarAlt className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Schedule Management</h3>
              <p className="text-gray-600">Keep track of your appointments, meetings, and deadlines.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-purple-600 mb-4">
                <FaFileAlt className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Document Access</h3>
              <p className="text-gray-600">Easy access to all your important documents and forms.</p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="text-pink-600 mb-4">
                <FaUserFriends className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Team Collaboration</h3>
              <p className="text-gray-600">Connect with your team members and collaborate efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Dashboard</h2>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <MainContent />
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">Access all your tools and resources in one place.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
              View Tasks
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
              Check Schedule
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default EmployeeHome