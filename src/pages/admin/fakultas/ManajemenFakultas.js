import React, { useState, useEffect } from "react";
import useTokenValidation from "../../../hook/TokenValidation";
import FacultyModal from "../../../components/modals/FacultyModal";
import SweetAlert from "../../../components/alerts/swal";
import { fetchFaculties, saveFaculty, deleteFaculty } from '../../../api/faculty';

function ManajemenFakultas() {
    useTokenValidation();

    const token = localStorage.getItem('access_token');
    const [faculties, setFaculties] = useState([]);
    const [filteredFaculties, setFilteredFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFaculty, setEditFaculty] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });

    const fetchFacultiesData = async () => {
        setLoading(true);
        try {
            const data = await fetchFaculties(token);
            setFaculties(data);
            setFilteredFaculties(data);
        } catch (error) {
            console.error("Error fetching faculties:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacultiesData();
    }, []);

    const handleSaveFaculty = async (facultyData) => {
        try {
            const updatedFaculty = await saveFaculty(facultyData, token, editFaculty ? editFaculty.id : null);

            if (editFaculty) {
                setFaculties((prev) =>
                    prev.map((faculty) => (faculty.id === updatedFaculty.id ? updatedFaculty : faculty))
                );
            } else {
                setFaculties((prev) => [...prev, updatedFaculty]);
            }

            setIsModalOpen(false);
            setEditFaculty(null);
        } catch (error) {
            console.error("Error saving faculty:", error.message || error);
        }
    };

    const handleEditFaculty = (faculty) => {
        setEditFaculty(faculty);
        setIsModalOpen(true);
    };

    const handleDeleteFaculty = async (id) => {
        const result = await SweetAlert.showConfirmation(
            "PERINGATAN!",
            "Menghapus Fakultas Akan Menghapus Seluruh Program Studi Pada Fakultas Tersebut!",
            "Yakin",
            "Batal"
        );
        if (result.isConfirmed) {
            try {
                await deleteFaculty(id, token);
                setFaculties((prevFaculties) => prevFaculties.filter((faculty) => faculty.id !== id));
                setFilteredFaculties((prevFiltered) => prevFiltered.filter((faculty) => faculty.id !== id));

                SweetAlert.showAlert(
                    "Berhasil",
                    "Fakultas dan Seluruh Program Studinya Berhasil Dihapus!",
                    "success",
                    "Tutup"
                );
            } catch (error) {
                console.error("Error deleting faculty:", error.message || error);
            }
        }
    };

    useEffect(() => {
        const filtered = faculties.filter((faculty) =>
            faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faculty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faculty.dean_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFaculties(filtered);
    }, [searchTerm, faculties]);

    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredFaculties].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredFaculties(sortedData);
    };

    const startIndex = (page - 1) * perPage;
    const paginatedData = filteredFaculties.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(filteredFaculties.length / perPage);

    return (
        <section className="section">
            <div className="section-header">
                <h1>Fakultas</h1>
            </div>
            <div className="section-body">
                <h2 className="section-title">Data Fakultas</h2>
                <p className="section-lead">
                    Silahkan kelola fakultas yang tersedia atau tambahkan jika belum ada.
                </p>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="mb-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            setEditFaculty(null);
                                        }}
                                    >
                                        Tambah Fakultas
                                    </button>
                                </div>
                                <div className="table-controls mb-3">
                                    <input
                                        type="text"
                                        placeholder="Cari Data"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="form-control mb-2"
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped" id="table-1">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th onClick={() => sortTable("code")}>
                                                    Kode Fakultas {sortConfig.key === "code" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                                </th>
                                                <th onClick={() => sortTable("name")}>
                                                    Nama Fakultas {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                                </th>
                                                <th onClick={() => sortTable("dean_name")}>
                                                    Nama Penanggung Jawab {sortConfig.key === "dean_name" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
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
                                                paginatedData.map((faculty, index) => (
                                                    <tr key={faculty.id}>
                                                        <td className="text-center">{startIndex + index + 1}</td>
                                                        <td>{faculty.code}</td>
                                                        <td>{faculty.name}</td>
                                                        <td>{faculty.dean_name}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => handleEditFaculty(faculty)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => handleDeleteFaculty(faculty.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No faculties available</td>
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
                        </div>
                    </div>
                </div>
            </div>
            {/* Faculty Modal */}
            <FacultyModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditFaculty(null);
                }}
                onSave={handleSaveFaculty}
                initialData={editFaculty}
            />
        </section>
    );
}

export default ManajemenFakultas;
