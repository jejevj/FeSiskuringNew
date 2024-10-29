import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function ClassModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        class_code: "",
        class_name_long: "",
        class_name_short: "",
        visibility: 1,
        start_date: "",
        end_date: "",
        description: "",
        class_thumbnail: null,
        tag: "",
        study_program: null,
        responsible_lecturer: null,
    });
    const [studyProgramList, setStudyProgramList] = useState([]);
    const [lecturerList, setLecturerList] = useState([]);

    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // Load initial data if provided (for editing)
    useEffect(() => {
        if (initialData) {
            setFormData({
                class_code: initialData.class_code || "",
                class_name_long: initialData.class_name_long || "",
                class_name_short: initialData.class_name_short || "",
                visibility: initialData.visibility || 1,
                start_date: initialData.start_date || "",
                end_date: initialData.end_date || "",
                description: initialData.description || "",
                class_thumbnail: initialData.class_thumbnail || null,
                tag: initialData.tag || "",
                study_program: initialData.study_program || null,
                responsible_lecturer: initialData.responsible_lecturer || null,
            });
        } else {
            setFormData({
                class_code: "",
                class_name_long: "",
                class_name_short: "",
                visibility: 1,
                start_date: "",
                end_date: "",
                description: "",
                class_thumbnail: null,
                tag: "",
                study_program: null,
                responsible_lecturer: null,
            });
        }
    }, [initialData]);

    // Fetch study program and lecturer data when the modal is open
    useEffect(() => {
        const fetchData = async () => {
            try {
                const programResponse = await fetch(baseUrl + `/api/prodi/study-programs/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const programData = await programResponse.json();
                setStudyProgramList(programData);

                const lecturerResponse = await fetch(baseUrl + `/api/auth/dosen/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const lecturerData = await lecturerResponse.json();
                setLecturerList(lecturerData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSelectChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    // Prepare options for Select components
    const studyProgramOptions = studyProgramList.map((program) => ({
        value: program.id,
        label: program.name
    }));

    const lecturerOptions = lecturerList.map((lecturer) => ({
        value: lecturer.id,
        label: `${lecturer.first_name} ${lecturer.last_name}`
    }));

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? "Edit Class" : "Add Class"}</h5>
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
                            name="class_code"
                            placeholder="Class Code"
                            value={formData.class_code}
                            onChange={handleChange}
                            className="form-control mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="class_name_long"
                            placeholder="Class Full Name"
                            value={formData.class_name_long}
                            onChange={handleChange}
                            className="form-control mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="class_name_short"
                            placeholder="Class Short Name"
                            value={formData.class_name_short}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />

                        {/* Dropdown for selecting Study Program */}
                        <Select
                            options={studyProgramOptions}
                            onChange={(option) => handleSelectChange("study_program", option)}
                            placeholder="Select Study Program"
                            className="mb-2"
                            value={studyProgramOptions.find(option => option.value === formData.study_program) || null}
                        />

                        {/* Dropdown for selecting Responsible Lecturer */}
                        <Select
                            options={lecturerOptions}
                            onChange={(option) => handleSelectChange("responsible_lecturer", option)}
                            placeholder="Select Responsible Lecturer"
                            className="mb-2"
                            value={lecturerOptions.find(option => option.value === formData.responsible_lecturer) || null}
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control mb-2"
                        ></textarea>

                        <input
                            type="date"
                            name="start_date"
                            placeholder="Start Date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="date"
                            name="end_date"
                            placeholder="End Date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />

                        <input
                            type="text"
                            name="tag"
                            placeholder="Tag"
                            value={formData.tag}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Batal
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassModal;
