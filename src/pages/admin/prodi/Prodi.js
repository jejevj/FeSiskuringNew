import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useTokenValidation from "../../../hook/TokenValidation";

function ManajemenProdi() {
    useTokenValidation();

    const token = localStorage.getItem('access_token');
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const baseUrl = `${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}`;

    // Fetch data from the API
    const fetchFaculties = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/faculty/faculties/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setFaculties(data);
        } catch (error) {
            console.error("Failed to fetch faculties:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter faculties based on the search term
    const filteredFaculties = faculties.filter((faculty) =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle card click to navigate to the specific faculty's page
    const handleCardClick = (facultyId) => {
        navigate(`/manajemen-prodi/${facultyId}`);
    };

    return (
        <>
            <section className="section">
                <div className="section-header">
                    <h1>Kelola Prodi</h1>
                </div>
                <div className="section-body">
                    <input
                        type="text"
                        placeholder="Cari Berdasarkan Nama dan Singkatan"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control mb-4"
                    />
                    <div className="row">
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredFaculties.length > 0 ? (
                            filteredFaculties.map((faculty) => (
                                <div
                                    key={faculty.id}
                                    className="col-lg-3 col-md-6 col-sm-6 col-12"
                                    onClick={() => handleCardClick(faculty.id)} // Make card clickable
                                    style={{ cursor: "pointer" }} // Change cursor to pointer
                                >
                                    <div className="card card-statistic-1">
                                        <div className="card-icon bg-primary">
                                            <i className="fas fa-graduation-cap "></i>
                                        </div>
                                        <div className="card-wrap">
                                            <div className="card-header">
                                                <h4>{faculty.name}</h4>
                                            </div>
                                            <div className="card-body">
                                                {faculty.code || "No code available"}
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

export default ManajemenProdi;
