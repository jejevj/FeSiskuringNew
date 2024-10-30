import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    listPengumuman,
    createPengumuman,
    updatePengumuman,
    deletePengumuman,
} from "../../../api/pengumuman";
import Select from 'react-select';
import { fetchFaculties, fetchFacultyById } from "../../../api/faculty";

function ListPengumuman() {
    const token = localStorage.getItem('access_token');
    const [facultyNames, setFacultyNames] = useState({});
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [formData, setFormData] = useState({

        faculty: "",
        judul: "",
        isi_pengumuman: "",
        image: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "faculty", direction: "ascending" });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await listPengumuman();
            setAnnouncements(data);
            setFilteredAnnouncements(data);
            data.forEach(async (announcement) => {
                if (announcement.faculty && !facultyNames[announcement.faculty]) {
                    try {
                        const facultyData = await fetchFacultyById(announcement.faculty, token);
                        setFacultyNames((prev) => ({
                            ...prev,
                            [announcement.faculty]: facultyData.name,
                        }));
                    } catch (error) {
                        console.error(`Error fetching faculty name: ${error.message}`);
                    }
                }
            });
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("judul", formData.judul);
        data.append("faculty", selectedFaculty ? selectedFaculty.value : "");
        data.append("isi_pengumuman", formData.isi_pengumuman);
        if (formData.image) data.append("image", formData.image);

        try {
            if (isEditing) {
                await updatePengumuman(editId, data);
            } else {
                await createPengumuman(data);
            }
            fetchAnnouncements();
            resetForm();
        } catch (error) {
            console.error("Error saving announcement:", error);
        }
    };

    const handleEdit = (announcement) => {
        setFormData({
            faculty: announcement.faculty || "",
            judul: announcement.judul,
            isi_pengumuman: announcement.isi_pengumuman,
            image: null,
        });

        const selected = faculties.find((faculty) => faculty.value === announcement.faculty);
        setSelectedFaculty(selected || null);

        setIsEditing(true);
        setEditId(announcement.id);
    };

    const handleDelete = async (id) => {
        try {
            await deletePengumuman(id);
            fetchAnnouncements();
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    const resetForm = () => {
        setFormData({ faculty: "", judul: "", isi_pengumuman: "", image: null });
        setSelectedFaculty(null);
        setIsEditing(false);
        setEditId(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        let filtered = announcements.filter((announcement) =>
            announcement.isi_pengumuman.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (announcement.faculty?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (announcement.judul || "").toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key) {
            filtered = filtered.sort((a, b) => {
                const aValue = a[sortConfig.key] || "";
                const bValue = b[sortConfig.key] || "";

                if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }

        setFilteredAnnouncements(filtered);
    }, [announcements, searchTerm, sortConfig]);

    const sortTable = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const loadFaculties = async () => {
            try {
                const data = await fetchFaculties(token);
                const facultyOptions = [
                    { value: "", label: "Semua Fakultas" },
                    ...data.map(faculty => ({
                        value: faculty.id,
                        label: faculty.name
                    }))
                ];

                setFaculties(facultyOptions);
            } catch (error) {
                console.error("Error fetching faculties:", error.message);
            }
        };

        loadFaculties();
    }, [token]);

    const handleFacultyChange = (selectedOption) => {
        setSelectedFaculty(selectedOption);
        setFormData({ ...formData, faculty: selectedOption ? selectedOption.value : "" });
    };

    return (
        <section className="section">
            <div className="section-header">
                <h1>Kelola Pengumuman</h1>
            </div>
            <div className="section-body">
                <h2 className="section-title">Pengumuman</h2>
                <p className="section-lead">Silahkan kelola dan edit pengumuman</p>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Cari Pengumuman"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control mb-2"
                    />
                </div>

                <div className="row">
                    <div className="col-12">
                        <h3>Daftar Pengumuman</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th onClick={() => sortTable("judul")}>
                                        Judul {sortConfig.key === "judul" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => sortTable("faculty")}>
                                        Faculty {sortConfig.key === "faculty" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnnouncements.map((announcement) => (
                                    <tr key={announcement.id}>
                                        {/* <td {announcement} /> */}
                                        <td>{announcement.judul}</td>
                                        <td>{facultyNames[announcement.faculty] || "Semua Fakultas"}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(announcement)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm mx-2"
                                                onClick={() => handleDelete(announcement.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>{isEditing ? "Edit Pengumuman" : "Tulis Pengumuman"}</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="faculty" className="col-form-label text-md-right col-12 col-md-3 col-lg-3">Select Faculty:</label>
                                        <div className="col-sm-12 col-md-7">
                                            <Select
                                                id="faculty"
                                                options={faculties}
                                                value={selectedFaculty}
                                                onChange={handleFacultyChange}
                                                placeholder="Select a faculty..."
                                            />
                                        </div>
                                    </div>

                                    {/* React Quill for Isi Pengumuman Field */}
                                    <div className="form-group row mb-4">
                                        <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                            Judul
                                        </label>
                                        <div className="col-sm-12 col-md-7">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="judul"
                                                value={formData.judul}
                                                onChange={(e) => handleInputChange("judul", e.target.value)} // Properly handle the input event
                                                placeholder="Enter the announcement title..."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-4">
                                        <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                            Isi Pengumuman
                                        </label>
                                        <div className="col-sm-12 col-md-7">
                                            <ReactQuill
                                                value={formData.isi_pengumuman}
                                                onChange={(value) => handleInputChange("isi_pengumuman", value)}
                                                placeholder="Write the announcement content here..."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-4">
                                        <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                            Image (Optional)
                                        </label>
                                        <div className="col-sm-12 col-md-7">
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-4">
                                        <div className="col-sm-12 col-md-7 offset-md-3">
                                            <button type="submit" className="btn btn-primary">
                                                {isEditing ? "Update Pengumuman" : "Create Pengumuman"}
                                            </button>
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary ml-2"
                                                    onClick={resetForm}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ListPengumuman;
