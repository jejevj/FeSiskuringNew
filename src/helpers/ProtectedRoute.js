// helpers/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();

    if (!token) {
        // Redirect them to the login page with the intended location
        localStorage.setItem('msg', '3'); //Belum Login
        return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
    }

    return children; // If the user is authenticated, render the children
};

export default ProtectedRoute;
