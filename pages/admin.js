// pages/admin.js
import { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null); // Add token state

  useEffect(() => {
    // Check if user is already authenticated
    const storedToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminUser');
   
    if (storedToken && adminData) {
      setIsAuthenticated(true);
      setAdmin(JSON.parse(adminData));
      setToken(storedToken); // Set the token
    }
   
    setLoading(false);
  }, []);

  const handleLogin = (adminData) => {
    const storedToken = localStorage.getItem('adminToken'); // Get token after login
    setIsAuthenticated(true);
    setAdmin(adminData);
    setToken(storedToken); // Set the token
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdmin(null);
    setToken(null); // Clear the token
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Header with logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {admin?.username}
              </h1>
              <p className="text-sm text-gray-500">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
     
      {/* Pass both token and onLogout props */}
      <AdminDashboard token={token} onLogout={handleLogout} />
    </div>
  );
};

export default AdminPage;