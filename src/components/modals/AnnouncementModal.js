// AnnouncementModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap"; // Import necessary Bootstrap components

function AnnouncementModal({ show, onClose, announcement }) {
    if (!announcement) return null;

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{announcement.judul}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div
                    dangerouslySetInnerHTML={{ __html: announcement.isi_pengumuman }}
                />
                <p><strong>Author:</strong> {announcement.author || "Anonymous"}</p>
                <p><strong>Updated At:</strong> {announcement.updated_at}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AnnouncementModal;
