import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTokenValidation from "../../../hook/TokenValidation";
import SweetAlert from "../../../components/alerts/swal";
import AccountModal from "../../../components/modals/AccountModal";

function ManajemenAkunDetail() {
    useTokenValidation();

    const { role } = useParams();
    const token = localStorage.getItem("access_token");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "username", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const baseUrl = `${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}`;

    // Fetch users based on role
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/auth/users/?role=${role}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role]);

    // Generate a random password
    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    // Handle saving a user
    const handleSaveUser = async (userData) => {
        try {
            const method = editUser ? 'PUT' : 'POST';
            const url = editUser ? `${baseUrl}/api/auth/users/${editUser.id}/` : `${baseUrl}/api/auth/register/`;

            // Set a generated password for new users
            if (!editUser) {
                userData.password = generateRandomPassword();
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const savedUser = await response.json();

            if (method === 'POST') {
                setUsers((prev) => [...prev, savedUser]);
                await sendEmail(savedUser.email, savedUser.username, userData.password);
            } else {
                setUsers((prev) => prev.map((user) => (user.id === savedUser.id ? savedUser : user)));
            }

            setIsModalOpen(false);
            setEditUser(null);
        } catch (error) {
            console.error("Error saving user:", error.message || error);
        }
    };

    // Function to send email with credentials
    const sendEmail = async (email, username, password) => {
        try {
            const emailData = {
                email: email,
                username: username,
                password: password,
            };

            await fetch(`${baseUrl}/api/email/send-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emailData),
            });
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error.message || error);
        }
    };

    // Handle file upload for bulk user upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("access", token);

        try {
            const response = await fetch(`${baseUrl}/api/auth/upload-excel/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                SweetAlert.showAlert("Gagal", "Gagal mengunggah file. Silakan coba lagi.", "error", "Tutup");
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("File uploaded successfully:", result);
            SweetAlert.showAlert("Berhasil", "File berhasil diunggah dan pengguna ditambahkan!", "success", "Tutup");

            // Refresh the user list after upload
            fetchUsers();
        } catch (error) {
            console.error("Error uploading file:", error.message || error);
            SweetAlert.showAlert("Gagal", "Gagal mengunggah file. Silakan coba lagi.", "error", "Tutup");
        }
    };

    // Additional functionalities: search, filter, sort, delete
    const handleDeleteUser = async (userId) => {
        const result = await SweetAlert.showConfirmation(
            "PERINGATAN!",
            "Apakah Anda yakin ingin menghapus pengguna ini?",
            "Yakin",
            "Batal"
        );
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${baseUrl}/api/auth/users/${userId}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete user with id ${userId}`);
                }

                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user.id !== userId));

                SweetAlert.showAlert("Berhasil", "Pengguna berhasil dihapus!", "success", "Tutup");
            } catch (error) {

                console.error("Error deleting user:", error.message || error);
            }
        }
    };
    // Sorting function
    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sortedData);
    };


    // Filtering and pagination
    const startIndex = (page - 1) * perPage;
    const paginatedData = filteredUsers.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    return (
        <section className="section">
            <div className="section-header">
                <h1>Manajemen Akun - {role}</h1>
            </div>
            <div className="section-body">
                <div className="d-flex mb-3">
                    <button
                        className="btn btn-primary mr-2"
                        onClick={() => {
                            setIsModalOpen(true);
                            setEditUser(null);
                        }}
                    >
                        Add Account
                    </button>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="form-control-file"
                        onChange={handleFileUpload}
                        style={{ display: "inline-block", width: "auto" }}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Cari Berdasarkan Nama atau Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mb-4"
                />
                <div className="table-responsive">
                    <table className="table table-striped" id="table-1">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th onClick={() => sortTable("username")}>
                                    NIM {sortConfig.key === "username" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => sortTable("email")}>
                                    Email {sortConfig.key === "email" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => sortTable("role")}>
                                    Role {sortConfig.key === "role" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                </th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">Loading...</td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="text-center">{startIndex + index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setEditUser(user);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-controls mt-3">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">Page {page} of {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                initialData={editUser}
            />
        </section>
    );
}

export default ManajemenAkunDetail;
