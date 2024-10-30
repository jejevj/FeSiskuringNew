// helpers/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SweetAlert from '../components/alerts/swal';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();

    // Define the routes that do not require authentication
    const publicPaths = ["/", "/dashboard"];

    if (!token && !publicPaths.includes(location.pathname)) {
        // SweetAlert.showAlert("Belum Login", "Silahkan Login Terlebih Dahulu", "error", "Tutup");
        return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
    }

    return children; // Render children if the user is authenticated or on a public route
};

export default ProtectedRoute;
