// pages/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed'); // Handle error
            }

            const data = await response.json();
            onLogin(data.access, data.refresh); // Call the onLogin function

            // Redirect to the original requested page or default to /

            localStorage.setItem('msg', '101'); //Belum Login
            const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
            navigate(redirectTo, { replace: true });

        } catch (error) {
            console.error(error);
            // Handle error, e.g., show error message to user
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
