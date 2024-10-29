import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';

function EnrollmentModal({ isOpen, onClose, token }) {
    const { id_kelas } = useParams(); // Get class ID from URL
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const [enrollments, setEnrollments] = useState([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newEnrollment, setNewEnrollment] = useState(null);
    const [mahasiswaOptions, setMahasiswaOptions] = useState([]); // List of available students for enrollment

    const baseUrl = process.env.REACT_APP_API_BASE_URL;


    // Fetch enrollments for the class
    const fetchEnrollments = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/class/class-enrollments/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            // Filter enrollments based on class_model
            const filtered = data.filter((enrollment) => enrollment.class_model === parseInt(id_kelas));
            setEnrollments(filtered);
            setFilteredEnrollments(filtered);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    // Fetch mahasiswa options based on faculty and role
    const fetchMahasiswaOptions = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/users/?role=mahasiswa`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            const options = data.map(user => ({ value: user.id, label: `${user.first_name} ${user.last_name}` }));
            setMahasiswaOptions(options);
        } catch (error) {
            console.error("Error fetching mahasiswa options:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchEnrollments();
            fetchMahasiswaOptions();
        }
    }, [isOpen]);

    // Handle search within the enrollment list
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredEnrollments(
            enrollments.filter(
                (enrollment) =>
                    enrollment.user.toString().includes(term) ||
                    enrollment.status.toLowerCase().includes(term)
            )
        );
    };

    // Handle adding a new enrollment
    const handleAddEnrollment = async () => {
        if (!newEnrollment) return;
        try {
            const response = await fetch(`${baseUrl}/api/class/class-enrollments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    user: newEnrollment,
                    class_model: parseInt(id_kelas),
                    status: "active",
                    enrollment_date: new Date().toISOString()
                })
            });

            const addedEnrollment = await response.json();
            setEnrollments([...enrollments, addedEnrollment]);
            setFilteredEnrollments([...filteredEnrollments, addedEnrollment]);
            setNewEnrollment(null); // Reset the select input
        } catch (error) {
            console.error("Error adding enrollment:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Kelola Mahasiswa</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                            aria-label="Close"
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "1.5rem",
                                lineHeight: "1",
                                margin: "0"
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* Search bar */}
                        <input
                            type="text"
                            placeholder="Cari mahasiswa berdasarkan status atau ID pengguna"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control mb-3"
                        />

                        {/* Add new enrollment */}
                        <Select
                            options={mahasiswaOptions}
                            onChange={(option) => setNewEnrollment(option.value)}
                            placeholder="Pilih mahasiswa untuk ditambahkan"
                            className="mb-3"
                        />
                        <button onClick={handleAddEnrollment} className="btn btn-primary mb-3">
                            Tambah Mahasiswa
                        </button>

                        {/* Enrollment Table */}
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User ID</th>
                                        <th>Status</th>
                                        <th>Enrollment Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnrollments.map((enrollment, index) => (
                                        <tr key={enrollment.id}>
                                            <td>{index + 1}</td>
                                            <td>{enrollment.user}</td>
                                            <td>{enrollment.status}</td>
                                            <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnrollmentModal;
