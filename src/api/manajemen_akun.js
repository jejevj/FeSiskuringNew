// src/api/manajemenakun.js

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("access_token");

// Helper function to handle common API logic
const handleApiResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

// Fetch users based on role
export const fetchUsers = async (role) => {
    const response = await fetch(`${apiUrl}/api/auth/users/?role=${role}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return await handleApiResponse(response);
};

// Save user (create or update)
export const saveUser = async (userData, editUser) => {
    const method = editUser ? 'PUT' : 'POST';
    const url = editUser
        ? `${apiUrl}/api/auth/users/${editUser.id}/`
        : `${apiUrl}/api/auth/register/`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    return await handleApiResponse(response);
};

// Send email with user credentials
export const sendEmail = async (email, username, password) => {
    const emailData = {
        email: email,
        username: username,
        password: password,
    };

    const response = await fetch(`${apiUrl}/api/email/send-email/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
    });

    return await handleApiResponse(response);
};

// Handle file upload for bulk user upload
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("access", token);

    const response = await fetch(`${apiUrl}/api/auth/upload-excel/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    return await handleApiResponse(response);
};

// Delete user by ID
export const deleteUser = async (userId) => {
    const response = await fetch(`${apiUrl}/api/auth/users/${userId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await handleApiResponse(response);
};
