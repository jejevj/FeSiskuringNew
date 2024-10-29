import React, { useState, useEffect } from "react";
import useTokenValidation from "../../../hook/TokenValidation";
import SweetAlert from "../../../components/alerts/swal";
import ClassModal from "../../../components/modals/ClassModal"; // Import modal for adding/editing Class

function ManajemenKelas() {
    useTokenValidation();

    const token = localStorage.getItem('access_token');
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editClass, setEditClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "class_name_long", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    const apiUrl = process.env.REACT_APP_API_BASE_URL;


    // Fetch class data
    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/class/classes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setClasses(data);
            setFilteredClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Handle saving a class (POST or PUT)
    const handleSaveClass = async (classData) => {
        try {
            const method = editClass ? 'PUT' : 'POST';
            const url = editClass ? `${apiUrl}/api/class/classes/${editClass.class_id}/` : `${apiUrl}/api/class/classes/`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(classData)
            });

            const savedClass = await response.json();

            if (method === 'POST') {
                setClasses((prev) => [...prev, savedClass]);
                SweetAlert.showAlert("Success", "Class added successfully!", "success", "Close");
            } else {
                setClasses((prev) => prev.map((cls) => (cls.class_id === savedClass.class_id ? savedClass : cls)));
                SweetAlert.showAlert("Success", "Class updated successfully!", "success", "Close");
            }

            setIsModalOpen(false);
            setEditClass(null);
        } catch (error) {
            console.error("Error saving class:", error.message || error);
            SweetAlert.showAlert("Error", "Failed to save class. Please try again.", "error", "Close");
        }
    };

    // Handle deleting a class
    const handleDeleteClass = async (classId) => {
        const result = await SweetAlert.showConfirmation(
            "Warning!",
            "Are you sure you want to delete this class?",
            "Yes",
            "Cancel"
        );
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${apiUrl}/api/class/classes/${classId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete class with id ${classId}`);
                }

                setClasses((prevClasses) => prevClasses.filter((cls) => cls.class_id !== classId));
                setFilteredClasses((prevFiltered) => prevFiltered.filter((cls) => cls.class_id !== classId));

                SweetAlert.showAlert("Deleted", "Class successfully deleted!", "success", "Close");
            } catch (error) {
                console.error("Error deleting class:", error.message || error);
                SweetAlert.showAlert("Error", "Failed to delete class. Please try again.", "error", "Close");
            }
        }
    };
    // Filter by search term
    useEffect(() => {
        const filtered = classes.filter(
            (cls) =>
                (cls.class_name_long && cls.class_name_long.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cls.class_code && cls.class_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cls.class_name_short && cls.class_name_short.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredClasses(filtered);
    }, [searchTerm, classes]);

    // Sorting function
    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredClasses].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredClasses(sortedData);
    };

    // Pagination
    const startIndex = (page - 1) * perPage;
    const paginatedData = filteredClasses.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(filteredClasses.length / perPage);

    return (
        <section className="section">
            <div className="section-header">
                <h1>Manajemen Kelas</h1>
            </div>
            <div className="section-body">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditClass(null);
                    }}
                >
                    Tambah Kelas
                </button>
                <input
                    type="text"
                    placeholder="Cari Berdasarkan Nama atau Kode Kelas"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mb-4"
                />
                <div className="table-responsive">
                    <table className="table table-striped" id="table-1">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th onClick={() => sortTable("class_code")}>
                                    Kode {sortConfig.key === "class_code" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => sortTable("class_name_long")}>
                                    Nama Panjang {sortConfig.key === "class_name_long" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => sortTable("class_name_short")}>
                                    Nama Pendek {sortConfig.key === "class_name_short" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
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
                                paginatedData.map((cls, index) => (
                                    <tr key={cls.class_id}>
                                        <td className="text-center">{startIndex + index + 1}</td>
                                        <td>{cls.class_code}</td>
                                        <td>{cls.class_name_long}</td>
                                        <td>{cls.class_name_short}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setEditClass(cls);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => handleDeleteClass(cls.class_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No classes available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
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
            {/* Class Modal */}
            <ClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClass}
                initialData={editClass}
            />
        </section>
    );
}

export default ManajemenKelas;
