// pages/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(username, password);
        if (result.success) {
            // Call onLogin with tokens to update the state in App
            onLogin(result.data.access, result.data.refresh);

            // Redirect to the requested page or to '/'
            const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
            navigate(redirectTo, { replace: true });
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
