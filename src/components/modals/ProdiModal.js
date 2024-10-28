import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function ProdiModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        faculty: null, // Store faculty ID
        head_of_program: null, // Store head of program ID
        description: "",
        established_year: "",
        contact_email: "",
        contact_phone: ""
    });
    const [facultyList, setFacultyList] = useState([]); // List of faculties
    const [dosenList, setDosenList] = useState([]); // List of head of programs (dosen)

    const token = localStorage.getItem('access_token');

    // Load initial data if provided
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                code: initialData.code || "",
                faculty: initialData.faculty || null,
                head_of_program: initialData.head_of_program || null,
                description: initialData.description || "",
                established_year: initialData.established_year || "",
                contact_email: initialData.contact_email || "",
                contact_phone: initialData.contact_phone || ""
            });
        } else {
            setFormData({
                name: "",
                code: "",
                faculty: null,
                head_of_program: null,
                description: "",
                established_year: "",
                contact_email: "",
                contact_phone: ""
            });
        }
    }, [initialData]);

    // Fetch faculty and dosen data when the modal is open
    useEffect(() => {
        const fetchData = async () => {
            try {
                const facultyResponse = await fetch(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/faculty/faculties/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const facultyData = await facultyResponse.json();
                setFacultyList(facultyData);

                const dosenResponse = await fetch(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/auth/dosen/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const dosenData = await dosenResponse.json();
                setDosenList(dosenData);
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
            [field]: selectedOption ? selectedOption.value : "", // Use `value` for ID
            ...(field === "head_of_program" && {
                contact_email: selectedOption?.email || "",
                contact_phone: selectedOption?.phone_number || ""
            })
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
    const dosenOptions = dosenList.map((dosen) => ({
        value: dosen.id,
        label: `${dosen.first_name} ${dosen.last_name}`,
        email: dosen.email,
        phone_number: dosen.phone_number
    }));

    const facultyOptions = facultyList.map((faculty) => ({
        value: faculty.id,
        label: faculty.name
    }));

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? "Edit Program Studi" : "Tambah Program Studi"}</h5>
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
                            name="name"
                            placeholder="Nama Program Studi"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="code"
                            placeholder="Kode Program Studi"
                            value={formData.code}
                            onChange={handleChange}
                            className="form-control mb-2"
                            required
                        />

                        {/* Dropdown for selecting Faculty */}
                        <Select
                            options={facultyOptions}
                            onChange={(option) => handleSelectChange("faculty", option)}
                            placeholder="Pilih Fakultas"
                            className="mb-2"
                            value={facultyOptions.find(option => option.value === formData.faculty) || null}
                        />

                        {/* Dropdown for selecting Head of Program */}
                        <Select
                            options={dosenOptions}
                            onChange={(option) => handleSelectChange("head_of_program", option)}
                            placeholder="Pilih Kepala Program"
                            className="mb-2"
                            value={dosenOptions.find(option => option.value === formData.head_of_program) || null}
                        />

                        <input
                            type="email"
                            name="contact_email"
                            placeholder="Email Kontak"
                            value={formData.contact_email}
                            onChange={handleChange}
                            className="form-control mb-2"
                            readOnly
                        />
                        <input
                            type="tel"
                            name="contact_phone"
                            placeholder="Telepon Kontak"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            className="form-control mb-2"
                            readOnly
                        />

                        <textarea
                            name="description"
                            placeholder="Deskripsi"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control mb-2"
                        ></textarea>
                        <input
                            type="number"
                            name="established_year"
                            placeholder="Tahun Berdiri"
                            value={formData.established_year}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Tutup
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProdiModal;
