import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { fetchFaculties } from '../../api/faculty';
import { fetchProdisByFaculty } from '../../api/prodi';

function AccountModal({ isOpen, onClose, onSave, initialData }) {
    const { role } = useParams(); // Get role from URL
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: role, // Set role from URL parameter
        birthdate: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        faculty: null,
        prodi: null,
    });

    const [facultyList, setFacultyList] = useState([]);
    const [prodiList, setProdiList] = useState([]);
    const token = localStorage.getItem('access_token');

    // Load initial data if provided (for editing)
    useEffect(() => {
        if (initialData) {
            setFormData((prevData) => ({
                ...prevData,
                ...initialData, // Spread initial data into formData
                password: prevData.password || "", // Retain existing password
                role: role, // Ensure role from URL
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                password: generateRandomPassword(), // Generate password on new account
                role: role, // Ensure role from URL
            }));
        }
    }, [initialData, role]);

    // Fetch faculty list when the modal is open
    useEffect(() => {
        const loadFaculties = async () => {
            try {
                const faculties = await fetchFaculties(token);
                setFacultyList(faculties);
            } catch (error) {
                console.error("Error fetching faculties:", error);
            }
        };

        if (isOpen) loadFaculties();
    }, [isOpen, token]);

    // Fetch study programs (prodi) when a faculty is selected
    useEffect(() => {
        const loadProdis = async (facultyId) => {
            try {
                const prodis = await fetchProdisByFaculty(facultyId, token);
                setProdiList(prodis);
            } catch (error) {
                console.error("Error fetching study programs:", error);
            }
        };

        if (formData.faculty) loadProdis(formData.faculty);
    }, [formData.faculty, token]);

    // Generate a random password
    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleSelectChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : "", // Use `value` for ID
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

    // Options for faculty selection
    const facultyOptions = facultyList.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
    }));

    // Options for prodi selection
    const prodiOptions = prodiList.map((prodi) => ({
        value: prodi.id,
        label: prodi.name,
    }));

    return (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{initialData ? "Edit Account" : "Add Account"}</h5>
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
                                margin: "0",
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-control mb-2"
                            required
                        />
                        <input
                            type="text"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            className="form-control mb-2"
                            readOnly
                        />
                        <input
                            type="date"
                            name="birthdate"
                            placeholder="Birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="form-control mb-2"
                        />
                        <Select
                            options={facultyOptions}
                            onChange={(option) => handleSelectChange("faculty", option)}
                            placeholder="Select Faculty"
                            className="mb-2"
                            value={facultyOptions.find((option) => option.value === formData.faculty)}
                        />
                        <Select
                            options={prodiOptions}
                            onChange={(option) => handleSelectChange("prodi", option)}
                            placeholder="Select Study Program"
                            className="mb-2"
                            value={prodiOptions.find((option) => option.value === formData.prodi)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountModal;
