// src/components/ManajemenAkunDetail.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTokenValidation from "../../../hook/TokenValidation";
import SweetAlert from "../../../components/alerts/swal";
import AccountModal from "../../../components/modals/AccountModal";
import {
    fetchUsers,
    saveUser,
    sendEmail,
    uploadFile,
    deleteUser,
} from "../../../api/manajemen_akun";

function ManajemenAkunDetail() {
    useTokenValidation();

    const { role } = useParams();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "username", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    useEffect(() => {
        loadUsers();
    }, [role]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchUsers(role);
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleSaveUser = async (userData) => {
        try {
            if (!editUser) {
                userData.password = generateRandomPassword();
            }

            const savedUser = await saveUser(userData, editUser);

            if (!editUser) {
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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await uploadFile(file);
            SweetAlert.showAlert("Berhasil", "File berhasil diunggah dan pengguna ditambahkan!", "success", "Tutup");
            loadUsers();
        } catch (error) {
            console.error("Error uploading file:", error.message || error);
            SweetAlert.showAlert("Gagal", "Gagal mengunggah file. Silakan coba lagi.", "error", "Tutup");
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await SweetAlert.showConfirmation(
            "PERINGATAN!",
            "Apakah Anda yakin ingin menghapus pengguna ini?",
            "Yakin",
            "Batal"
        );
        if (result.isConfirmed) {
            try {
                await deleteUser(userId);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user.id !== userId));
                SweetAlert.showAlert("Berhasil", "Pengguna berhasil dihapus!", "success", "Tutup");
            } catch (error) {
                console.error("Error deleting user:", error.message || error);
            }
        }
    };

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
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tambah Akun
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
                                <th onClick={() => sortTable("username")}>NIM</th>
                                <th onClick={() => sortTable("email")}>Email</th>
                                <th onClick={() => sortTable("role")}>Role</th>
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
