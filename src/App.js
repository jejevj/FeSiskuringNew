import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Helpers
import ProtectedRoute from './helpers/ProtectedRoute';

// Pages
import Homepage from './pages/Home';
import LoginPage from './pages/Login';
import TesPage from './pages/Tes2';
import MainLayout from './components/MainLayout';
import SweetAlert from './components/alerts/swal';
import NotFound from './pages/NotFound'; // Import the NotFound component
import Profil from './pages/auth/Profil';
import ManajemenFakultas from './pages/admin/fakultas/ManajemenFakultas';
import ManajemenProdi from './pages/admin/prodi/Prodi';
import ManajemenProdiDetail from './pages/admin/prodi/ManajemenProdi';
import ManajemenAkun from './pages/admin/account/ManajemenAkun';
import ManajemenAkunDetail from './pages/admin/account/ManajemenAkunDetail';
import ManajemenKelas from './pages/admin/class/ManajemenKelas';
import ListKelasDosen from './pages/dosen/kelas/ListKelas';
import KelasDosenDetail from './pages/dosen/kelas/KelasDosenDetail';
import DesktopOnlyWarning from './pages/DesktopOnlyWarning';
import { logout } from './api/auth';
import ListPengumuman from './pages/admin/pengumuman/ListPengumuman';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
  }, []);

  const handleLogin = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const result = await logout(token, refreshToken);
    if (result.success) {
      SweetAlert.showAlert("Berhasill Logout", "Kamu telah dialihkan ke halaman Login", "success", "Tutup")
      setToken(null);
      // I Want it navigate to /login
      navigate('/login');
    } else if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <div id="app">
      <DesktopOnlyWarning />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <Homepage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/tes" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <TesPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <Profil />
            </MainLayout>
          </ProtectedRoute>
        } />




        {/* SUPER ADMIN ROUTE */}
        <Route path="/manajemen-fakultas" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenFakultas />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/manajemen-prodi" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenProdi />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        {/* Dynamic route for detailed faculty info */}
        <Route path="/manajemen-prodi/:facultyId" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenProdiDetail />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/manajemen-akun" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenAkun />
            </MainLayout>
          </ProtectedRoute>
        }
        />

        <Route path="/manajemen-akun/:role" element={

          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenAkunDetail />
            </MainLayout>
          </ProtectedRoute>
        }
        />


        <Route path="/manajemen-kelas" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ManajemenKelas />
            </MainLayout>
          </ProtectedRoute>
        }
        />

        <Route path="/manajemen-pengumuman" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ListPengumuman />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        {/* 
          <Route path="/manajemen-kelas/:role" element={

            <ProtectedRoute>
              <MainLayout onLogout={handleLogout}>
                <ManajemenAkunDetail />
              </MainLayout>
            </ProtectedRoute>
          }
          /> */}


        {/* ROUTE FOR DOSEN */}

        <Route path="/dosen/kelas" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <ListKelasDosen />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route path="/dosen/kelas/:id_kelas" element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout}>
              <KelasDosenDetail />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} /> {/* This will catch all unmatched routes */}
      </Routes>
    </div>
    // </BrowserRouter>
  );
}

export default App;
