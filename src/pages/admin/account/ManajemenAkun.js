import React, { useState } from "react";
import useTokenValidation from "../../../hook/TokenValidation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ManajemenAkun() {
    useTokenValidation();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    // Predefined user categories
    const categories = [
        { id: 'superadmin', name: 'Super Admin' },
        { id: 'manajemen', name: 'Manajemen' },
        { id: 'staff_prodi', name: 'Staff Prodi' },
        { id: 'dosen', name: 'Dosen' },
        { id: 'mahasiswa', name: 'Mahasiswa' }
    ];

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter categories based on the search term
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle card click to navigate to the specific category's page
    const handleCardClick = (categoryId) => {
        navigate(`/manajemen-akun/${categoryId}`);
    };

    return (
        <>
            <section className="section">
                <div className="section-header">
                    <h1>Kelola Akun</h1>
                </div>
                <div className="section-body">
                    <input
                        type="text"
                        placeholder="Cari Berdasarkan Kategori"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control mb-4"
                    />
                    <div className="row">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="col-lg-3 col-md-6 col-sm-6 col-12"
                                    onClick={() => handleCardClick(category.id)} // Make card clickable
                                    style={{ cursor: "pointer" }} // Change cursor to pointer
                                >
                                    <div className="card card-statistic-1">
                                        <div className="card-icon bg-primary">
                                            <i className="fas fa-user-shield"></i> {/* Change icon to reflect user type */}
                                        </div>
                                        <div className="card-wrap">
                                            <div className="card-header">
                                                <h4>{category.name}</h4>
                                            </div>
                                            <div className="card-body">
                                                ID: {category.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No results found</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ManajemenAkun;
