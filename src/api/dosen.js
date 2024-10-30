// src/api/dosen.js
import { apiUrl } from '../config'; // Assuming apiUrl is centrally defined

export const fetchDosen = async (token) => {
    const response = await fetch(`${apiUrl}/api/auth/dosen/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dosen data');
    }

    return response.json();
};
