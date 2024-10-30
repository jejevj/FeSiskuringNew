// src/api/faculty.js
import { apiUrl } from '../config'; // Assuming apiUrl is centrally defined

export const fetchFaculties = async (token) => {
    const response = await fetch(`${apiUrl}/api/faculty/faculties/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const saveFaculty = async (facultyData, token, editFacultyId = null) => {
    const method = editFacultyId ? 'PUT' : 'POST';
    const url = editFacultyId ? `${apiUrl}/api/faculty/faculties/${editFacultyId}/` : `${apiUrl}/api/faculty/faculties/`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(facultyData)
    });

    if (!response.ok) {
        throw new Error('Failed to save faculty');
    }
    return response.json();
};

export const deleteFaculty = async (id, token) => {
    const response = await fetch(`${apiUrl}/api/faculty/faculties/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete faculty with id ${id}`);
    }
    return id; // Return the ID of the deleted faculty
};

export const fetchFacultyById = async (id, token) => {
    const response = await fetch(`${apiUrl}/api/faculty/faculties/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch faculty with id ${id}`);
    }
    return response.json();
};
