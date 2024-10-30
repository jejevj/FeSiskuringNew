// src/api/prodi.js
import { apiUrl } from '../config'; // Centralized configuration file for API base URLs

export const fetchUsers = async (token) => {
    try {
        const response = await fetch(`${apiUrl}/api/auth/users/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return Array.isArray(data) ? data : [] // Ensure data is an array
    } catch (error) {
        console.error("Error fetching users:", error.message || error);
        return []
    }
};

export const fetchProdisByFaculty = async (facultyId, token) => {
    try {
        const response = await fetch(`${apiUrl}/api/prodi/study-programs/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.filter((prodi) => prodi.faculty === parseInt(facultyId));
    } catch (error) {
        console.error("Error fetching study programs:", error);
        throw error;
    }
};

export const saveProdi = async (prodiData, token, editProdiId = null) => {
    const method = editProdiId ? 'PUT' : 'POST';
    const url = editProdiId
        ? `${apiUrl}/api/prodi/study-programs/${editProdiId}/`
        : `${apiUrl}/api/prodi/study-programs/`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prodiData)
    });

    if (!response.ok) {
        throw new Error('Failed to save study program');
    }
    return response.json();
};

export const deleteProdi = async (id, token) => {
    const response = await fetch(`${apiUrl}/api/prodi/study-programs/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete study program with id ${id}`);
    }
    return id;
};
