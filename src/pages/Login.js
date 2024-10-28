// pages/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SweetAlert from '../components/alerts/swal';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First API call to log in
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            // Check if the response is ok
            if (!response.ok) {
                await SweetAlert.showAlert(
                    'Login Gagal',
                    'Silahkan Periksa Kembali Data Yang Anda Masukkan',
                    'error',
                    'Tutup'
                );
                throw new Error('Login failed'); // Throw error to skip to catch block
            }

            // If login is successful, get the data
            const data = await response.json();

            // Fetch user profile using the received access token
            const profileResponse = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
                headers: {
                    Authorization: `Bearer ${data.access}`,
                },
            });

            // Check if profile fetch is successful
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                localStorage.setItem('userProfile', JSON.stringify(profileData)); // Store user profile

                // Call the onLogin function to update the token state
                onLogin(data.access, data.refresh);

                // Redirect to the original requested page or default to '/'
                const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
                navigate(redirectTo, { replace: true });
            } else {
                throw new Error('Failed to fetch profile data');
            }

        } catch (error) {
            console.error('Error during login:', error);

        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
