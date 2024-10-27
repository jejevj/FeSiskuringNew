import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Helpers
import ProtectedRoute from './helpers/ProtectedRoute';

// Pages
import Homepage from './pages/Home';
import LoginPage from './pages/Login';
import TesPage from './pages/Tes2';
import MainLayout from './components/MainLayout';
import SweetAlert from './components/alerts/swal';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
  }, []);

  const handleLogin = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken); // Update the token state
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const token = localStorage.getItem('access_token');

    const result = await SweetAlert.showConfirmation(
      'Kamu Yakin?',
      'Kamu akan keluar dari akun Siskuring??',
      'Ya',
      'Batal'
    );

    if (result.isConfirmed) {
      if (refreshToken) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ refresh: refreshToken }), // Sending refresh token
          });

          if (response.ok) {
            // Successfully logged out
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setToken(null);
          } else {
            // Handle errors if needed
            console.error('Logout failed:', response.status);
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      } else {
        // If no refresh token, just remove tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
      }
    }
  };

  return (
    <BrowserRouter>
      <div id="app">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}> {/* Pass handleLogout here */}
                <Homepage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/tes" element={
            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}> {/* Pass handleLogout here */}
                <TesPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
