import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

function TopicModal({ isOpen, onClose, onSave, token, classModel }) {
    const [topicName, setTopicName] = useState("");
    const [order, setOrder] = useState(1);
    const [description, setDescription] = useState("");
    const [moduleFile, setModuleFile] = useState(null);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("topic_name", topicName);
        formData.append("order", order);
        formData.append("description", description);
        formData.append("class_model", classModel);
        formData.append("is_evaluated", true);
        if (moduleFile) formData.append("module_file", moduleFile);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/topic/topics/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const newTopic = await response.json();
                onSave(newTopic); // Update the parent component with the new topic
                onClose();

                // Show SweetAlert success message
                Swal.fire({
                    icon: 'success',
                    title: 'Topik Ditambahkan',
                    text: 'Topik berhasil ditambahkan!',
                    confirmButtonText: 'OK'
                });
            } else {
                throw new Error("Failed to add topic");
            }
        } catch (error) {
            console.error("Error adding topic:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal menambahkan topik. Coba lagi nanti.',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Topik Baru</h5>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                            aria-label="Close"
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "1.5rem",
                                lineHeight: "1",
                                margin: "0"
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            placeholder="Nama Topik"
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                            className="form-control mb-2"
                        />
                        <input
                            type="number"
                            placeholder="Urutan"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="form-control mb-2"
                        />
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            className="mb-2"
                            placeholder="Deskripsi topik..."
                        />
                        <input
                            type="file"
                            onChange={(e) => setModuleFile(e.target.files[0])}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Tutup
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Simpan Topik
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopicModal;
