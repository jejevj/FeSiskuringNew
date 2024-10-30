import React, { useState, useEffect } from "react";
import useTokenValidation from "../hook/TokenValidation";
import { listPengumuman } from "../api/pengumuman";
import AnnouncementModal from "../components/modals/AnnouncementModal";

function Homepage() {
    useTokenValidation();

    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await listPengumuman();
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleAnnouncementClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
    };

    return (
        <>
            <section className="section mt-3">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-hero">
                            <div className="card-header">
                                <div className="card-icon">
                                    <i className="far fa-question-circle" />
                                </div>
                                <h4>{announcements.length}</h4>
                                <div className="card-description">Pengumuman</div>
                            </div>
                            <div className="card-body p-0">
                                <div className="tickets-list">
                                    {announcements.slice(0, 3).map((announcement) => (
                                        <div
                                            key={announcement.id}
                                            className="ticket-item"
                                            onClick={() => handleAnnouncementClick(announcement)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="ticket-title">
                                                <h4>{announcement.judul}</h4>
                                            </div>
                                            <div className="ticket-info">
                                                <div>{announcement.author || "Anonymous"}</div>
                                                <div className="bullet" />
                                                <div className="text-primary">{announcement.updated_at || "Just now"}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <a href="/all-announcements" className="ticket-item ticket-more">
                                        View All <i className="fas fa-chevron-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Render the modal */}
            <AnnouncementModal
                show={showModal}
                onClose={handleCloseModal}
                announcement={selectedAnnouncement}
            />
        </>
    );
}

export default Homepage;
