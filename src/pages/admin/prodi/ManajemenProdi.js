import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTokenValidation from "../../../hook/TokenValidation";
import SweetAlert from "../../../components/alerts/swal";
import ProdiModal from "../../../components/modals/ProdiModal";
import { fetchProdisByFaculty, saveProdi, deleteProdi, fetchUsers } from "../../../api/prodi";

function ManajemenProdiDetail() {
    useTokenValidation();

    const { facultyId } = useParams();
    const token = localStorage.getItem("access_token");
    const [prodis, setProdis] = useState([]);
    const [filteredProdis, setFilteredProdis] = useState([]);
    const [users, setUsers] = useState([]); // Ensure users is initialized as an array
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProdi, setEditProdi] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    // Fetch users for head of program names
    // const fetchUsers = async () => {
    //     try {
    //         const response = await fetch(`${apiUrl}/api/auth/users/`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         const data = await response.json();
    //         setUsers(Array.isArray(data) ? data : []); // Ensure data is an array
    //     } catch (error) {
    //         console.error("Error fetching users:", error.message || error);
    //         setUsers([]); // Fallback to empty array if fetch fails
    //     }
    // };


    // Fetch prodis based on faculty ID
    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchUsers(token);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching Users:", error.message || error);
        } finally {
            setLoading(false);
        }
    }
    const loadProdis = async () => {
        setLoading(true);
        try {
            const data = await fetchProdisByFaculty(facultyId, token);
            setProdis(data);
            setFilteredProdis(data);
        } catch (error) {
            console.error("Error fetching study programs:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadProdis();
    }, [facultyId]);

    const handleSaveProdi = async (prodiData) => {
        try {
            const savedProdi = await saveProdi(
                { ...prodiData, faculty: parseInt(facultyId, 10) },
                token,
                editProdi ? editProdi.id : null
            );

            if (editProdi) {
                setProdis((prev) => prev.map((prodi) => (prodi.id === savedProdi.id ? savedProdi : prodi)));
            } else {
                setProdis((prev) => [...prev, savedProdi]);
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
                await deleteProdi(id, token);

                setProdis((prevProdis) => prevProdis.filter((prodi) => prodi.id !== id));
                setFilteredProdis((prevFiltered) => prevFiltered.filter((prodi) => prodi.id !== id));

                SweetAlert.showAlert("Berhasil", "Program Studi Berhasil Dihapus!", "success", "Tutup");
            } catch (error) {
                console.error("Error deleting study program:", error.message || error);
            }
        }
    };

    // Filter by search term
    useEffect(() => {
        const filtered = prodis.filter((prodi) => {
            const headOfProgram = Array.isArray(users)
                ? users.find((user) => user.id === prodi.head_of_program)
                : null;
            return (
                (prodi.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
                (prodi.code?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
                (headOfProgram?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
            );
        });
        setFilteredProdis(filtered);
    }, [searchTerm, prodis, users]);

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
                                                        <td>
                                                            {prodi.head_of_program
                                                                ? (users.find(user => user.id == prodi.head_of_program)?.first_name + " " + users.find(user => user.id == prodi.head_of_program)?.last_name || "No Head")
                                                                : "No Head"}
                                                        </td>
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
            <ProdiModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditProdi(null);
                }}
                onSave={handleSaveProdi}
                initialData={editProdi}
            />
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
