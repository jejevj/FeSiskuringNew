import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchDosen } from '../../api/dosen'; // Import the new API function

function FacultyModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        dean_name: "",
        description: "",
        established_year: "",
        contact_email: "",
        contact_phone: ""
    });
    const [dosenList, setDosenList] = useState([]); // State to store dosen list
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // Load initial data when provided
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                code: initialData.code || "",
                dean_name: initialData.dean_name || "",
                description: initialData.description || "",
                established_year: initialData.established_year || "",
                contact_email: initialData.contact_email || "",
                contact_phone: initialData.contact_phone || ""
            });
        }
    }, [initialData]);

    // Fetch dosen data when the modal is open
    useEffect(() => {
        const loadDosenData = async () => {
            try {
                const data = await fetchDosen(token); // Use the new API function
                setDosenList(data);
            } catch (error) {
                console.error("Error fetching dosen data:", error);
            }
        };

        if (isOpen) {
            loadDosenData(); // Only fetch dosen data when the modal is open
        }
    }, [isOpen, token]);

    const handleDeanChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            dean_name: selectedOption.label,
            contact_email: selectedOption.email,
            contact_phone: selectedOption.phone_number
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

    const dosenOptions = dosenList.map((dosen) => ({
        value: dosen.id,
        label: `${dosen.first_name} ${dosen.last_name}`,
        email: dosen.email,
        phone_number: dosen.phone_number
    }));

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? "Edit Fakultas" : "Tambah Fakultas"}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama Fakultas"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="code"
                            placeholder="Kode Fakultas"
                            value={formData.code}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        {/* Dropdown for Penanggung Jawab with react-select */}
                        <Select
                            options={dosenOptions}
                            onChange={handleDeanChange}
                            placeholder="Pilih Penanggung Jawab"
                            className="mb-2"
                            value={dosenOptions.find(option => option.label === formData.dean_name) || null}
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
                        <input
                            type="text"
                            name="description"
                            placeholder="Deskripsi"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
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

export default FacultyModal;
