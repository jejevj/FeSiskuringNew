const apiUrl = process.env.REACT_APP_API_BASE_URL; // Set your base URL here

// Helper function to fetch the token
const getToken = () => {
    return localStorage.getItem('access_token');
};

// Create Pengumuman
export const createPengumuman = async (data) => {
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/announce/pengumuman/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: data, // Pass FormData directly
        });
        if (!response.ok) throw new Error('Failed to create announcement');
        return await response.json();
    } catch (error) {
        console.error("Error creating pengumuman:", error);
        throw error;
    }
};

// List All Pengumuman
export const listPengumuman = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/announce/pengumuman/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch announcements');
        return await response.json();
    } catch (error) {
        console.error("Error fetching pengumuman list:", error);
        throw error;
    }
};

// Retrieve Specific Pengumuman
export const retrievePengumuman = async (id) => {
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/announce/pengumuman/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to retrieve announcement');
        return await response.json();
    } catch (error) {
        console.error(`Error retrieving pengumuman ${id}:`, error);
        throw error;
    }
};

// Update Pengumuman
export const updatePengumuman = async (id, data) => {
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/announce/pengumuman/${id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: data, // Pass FormData directly
        });
        if (!response.ok) throw new Error('Failed to update announcement');
        return await response.json();
    } catch (error) {
        console.error(`Error updating pengumuman ${id}:`, error);
        throw error;
    }
};

// Delete Pengumuman
export const deletePengumuman = async (id) => {
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/announce/pengumuman/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete announcement');
        return response.status === 204 ? {} : await response.json();
    } catch (error) {
        console.error(`Error deleting pengumuman ${id}:`, error);
        throw error;
    }
};
