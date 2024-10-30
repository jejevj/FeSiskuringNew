// src/api/auth.js
import SweetAlert from '../components/alerts/swal';
import { apiUrl } from '../config'; // assuming apiUrl is centrally defined in a config file

export const logout = async (token, refreshToken) => {
    const result = await SweetAlert.showConfirmation(
        'Kamu Yakin?',
        'Kamu akan keluar dari akun Siskuring??',
        'Ya',
        'Batal'
    );

    if (result.isConfirmed) {
        if (refreshToken) {
            try {
                const response = await fetch(`${apiUrl}/api/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (response.ok) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('userProfile');
                    return { success: true };
                } else {
                    console.error('Logout failed:', response.status);
                    return { success: false, error: 'Logout failed' };
                }
            } catch (error) {
                console.error('Error during logout:', error);
                return { success: false, error: 'Network error' };
            }
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userProfile');
            return { success: true };
        }
    } else {
        return { success: false, canceled: true };
    }
};



export const login = async (username, password) => {
    try {
        // API call to log in
        const response = await fetch(`${apiUrl}/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        // Check for a successful response
        if (!response.ok) {
            await SweetAlert.showAlert(
                'Login Gagal',
                'Silahkan Periksa Kembali Data Yang Anda Masukkan',
                'error',
                'Tutup'
            );
            return { success: false };
        }

        // Get the login response data
        const data = await response.json();
        // Fetch user profile with access token
        const profileResponse = await fetch(`${apiUrl}/api/auth/profile/`, {
            headers: {
                Authorization: `Bearer ${data.access}`,
            },
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            localStorage.setItem('userProfile', JSON.stringify(profileData)); // Store user profile
            return { success: true, data };
        } else {
            throw new Error('Failed to fetch profile data');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: error.message };
    }
};