import React, { useState, useEffect } from "react";
import useTokenValidation from "../../../hook/TokenValidation";

function ListKelasDosen() {
    useTokenValidation();

    const token = localStorage.getItem("access_token");
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = `${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}`;

    // Fetch classes and filter based on user ID
    const fetchClasses = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/class/classes/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();

            // Filter classes where responsible_lecturer matches the user profile ID
            const filteredClasses = data.filter(
                (cls) => cls.responsible_lecturer === userProfile.id
            );

            setClasses(filteredClasses);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <>
            <section className="section">
                <div className="section-header">
                    <h1>Kelas</h1>
                </div>
                <h2 className="section-title">Kelas yang kamu terima</h2>
                {loading ? (
                    <p>Loading classes...</p>
                ) : (
                    <div className="row">
                        {classes.length > 0 ? (
                            classes.map((cls) => (
                                <div key={cls.class_id} className="col-12 col-sm-6 col-md-6 col-lg-3">
                                    <article className="article article-style-b">
                                        <div className="article-header">
                                            <div
                                                className="article-image"
                                                style={{
                                                    backgroundImage: `url(${cls.class_thumbnail || "https://cdn6.f-cdn.com/contestentries/1162950/18299824/59ef996d1981d_thumb900.jpg"})`,
                                                }}
                                            ></div>
                                            <div className="article-badge">
                                                {cls.tag && (
                                                    <div className="article-badge-item bg-danger">
                                                        {cls.tag}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="article-details">
                                            <div className="article-title">
                                                <h2>{cls.class_name_long}</h2>
                                            </div>
                                            <p>{cls.description}</p>
                                            <div className="article-cta">
                                                <a href={`/dosen/kelas/${cls.class_id}`}>
                                                    Kelola Kelas <i className="fas fa-chevron-right" />
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))
                        ) : (
                            <p>No classes found.</p>
                        )}
                    </div>
                )}
            </section>
        </>
    );
}

export default ListKelasDosen;
