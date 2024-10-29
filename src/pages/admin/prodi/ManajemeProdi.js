import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTokenValidation from "../../../hook/TokenValidation";
import SweetAlert from "../../../components/alerts/swal";
import ProdiModal from "../../../components/modals/ProdiModal"; // Import modal for adding/editing Prodi

function ManajemenProdiDetail() {
    useTokenValidation();

    const { facultyId } = useParams(); // Get faculty ID from the URL
    const token = localStorage.getItem('access_token');
    const [prodis, setProdis] = useState([]);
    const [filteredProdis, setFilteredProdis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProdi, setEditProdi] = useState(null); // New state for editing
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    // Fetch data from the API
    const fetchProdis = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/prodi/study-programs/`, {
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
            const facultyFilteredData = data.filter((prodi) => prodi.faculty === parseInt(facultyId)); // Filter by facultyId
            setProdis(facultyFilteredData);
            setFilteredProdis(facultyFilteredData);
        } catch (error) {
            console.error("Error fetching study programs:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchProdis();
    }, [facultyId]); // Refetch if facultyId changes

    const handleSaveProdi = async (prodiData) => {
        try {
            const method = editProdi ? 'PUT' : 'POST';
            const url = editProdi ? `${apiUrl}/api/prodi/study-programs/${editProdi.id}/` : `${apiUrl}/api/prodi/study-programs/`;

            const payload = {
                ...prodiData,
                faculty: parseInt(facultyId, 10), // Set faculty to the URL's facultyId
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const updatedProdi = await response.json();

            if (method === 'POST') {
                setProdis((prev) => [...prev, updatedProdi]);
            } else {
                setProdis((prev) =>
                    prev.map((prodi) => (prodi.id === updatedProdi.id ? updatedProdi : prodi))
                );
            }

            setIsModalOpen(false);
            setEditProdi(null);
        } catch (error) {
            console.error("Error saving study program:", error.message || error);
        }
    };

    const handleEditProdi = (prodi) => {
        setEditProdi(prodi);
        setIsModalOpen(true);
    };

    const handleDeleteProdi = async (id) => {
        const result = await SweetAlert.showConfirmation(
            "PERINGATAN!",
            "Apakah Anda yakin ingin menghapus Program Studi ini?",
            "Yakin",
            "Batal"
        );
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${apiUrl}/api/prodi/study-programs/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete study program with id ${id}`);
                }

                setProdis((prevProdis) => prevProdis.filter((prodi) => prodi.id !== id));
                setFilteredProdis((prevFiltered) => prevFiltered.filter((prodi) => prodi.id !== id));

                SweetAlert.showAlert(
                    "Berhasil",
                    "Program Studi Berhasil Dihapus!",
                    "success",
                    "Tutup"
                );
            } catch (error) {
                console.error("Error deleting study program:", error.message || error);
            }
        }
    };

    // Filter by search term
    useEffect(() => {
        const filtered = prodis.filter((prodi) =>
            (prodi.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
            (prodi.code?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
            (prodi.head_of_program?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
        );
        setFilteredProdis(filtered);
    }, [searchTerm, prodis]);

    // Sorting function
    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredProdis].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredProdis(sortedData);
    };

    // Pagination
    const startIndex = (page - 1) * perPage;
    const paginatedData = filteredProdis.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(filteredProdis.length / perPage);

    return (
        <section className="section">
            <div className="section-header">
                <h1>Program Studi</h1>
            </div>
            <div className="section-body">
                <h2 className="section-title">Data Program Studi</h2>
                <p className="section-lead">
                    Silahkan kelola program studi yang tersedia atau tambahkan jika belum ada.
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
                                            setEditProdi(null);
                                        }}
                                    >
                                        Tambah Program Studi
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
                                                    Kode {sortConfig.key === "code" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                                </th>
                                                <th onClick={() => sortTable("name")}>
                                                    Nama Program Studi {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                                </th>
                                                <th onClick={() => sortTable("head_of_program")}>
                                                    Nama Kepala Program {sortConfig.key === "head_of_program" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
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
                                                paginatedData.map((prodi, index) => (
                                                    <tr key={prodi.id}>
                                                        <td className="text-center">{startIndex + index + 1}</td>
                                                        <td>{prodi.code}</td>
                                                        <td>{prodi.name}</td>
                                                        <td>{prodi.head_of_program}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => handleEditProdi(prodi)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => handleDeleteProdi(prodi.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No study programs available</td>
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
            {/* Prodi Modal */}
            <ProdiModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditProdi(null);
                }}
                onSave={handleSaveProdi}
                initialData={editProdi}
            />
        </section>
    );
}

export default ManajemenProdiDetail;
