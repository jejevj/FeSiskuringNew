import React, { useState } from "react";
import useTokenValidation from "../../hook/TokenValidation";
import { useLocation, Link } from 'react-router-dom';
import SweetAlert from "../../components/alerts/swal";
import { useNavigate } from 'react-router-dom';

function ProfilPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const role = userProfile ? userProfile.role : null;
    const username = userProfile ? userProfile.username : null;
    const email = userProfile ? userProfile.email : null;
    const tgl_lahir = userProfile ? userProfile.birthdate : null;
    const hp = userProfile ? String(userProfile.phone_number) : null;
    const nama = userProfile ? userProfile.first_name : null;
    const nama2 = userProfile ? userProfile.last_name : null;
    const token = localStorage.getItem('access_token');
    const nama_lengkap = `${nama} ${nama2}`;
    const last_login = userProfile ? userProfile.last_login : null;

    useTokenValidation();

    // State for password fields and API feedback
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");

    // UBAH PASSWORD
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        // Basic validation for new password confirmation
        if (newPassword !== confirmNewPassword) {
            SweetAlert.showAlert(
                "Oops!",
                "Konfirmasi Password Tidak Sesuai",
                "error",
                "Tutup"
            )
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/auth/update-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include an Authorization header if required
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_new_password: confirmNewPassword
                })
            });

            const result = await response.json();

            // Check for successful response
            if (response.ok) {
                SweetAlert.showAlert(
                    "Berhasil",
                    "Password diperbarui",
                    "success",
                    "Ok"
                ).then(() => {

                    navigate("/", { replace: true });
                }); // Adjust delay as needed
            } else {
                if (result.confirm_new_password) {
                    SweetAlert.showAlert(
                        "Oops!",
                        "Password Konfirmasi Tidak Sama",
                        "error",
                        "Tutup"
                    )

                } else if (result.new_password_same) {
                    SweetAlert.showAlert(
                        "Oops!",
                        "Password Tidak Boleh Sama Dengan Password Saat Ini",
                        "error",
                        "Tutup"
                    )
                } else if (result.current_password) {
                    SweetAlert.showAlert(
                        "Oops!",
                        "Password Saat Ini Salah",
                        "error",
                        "Tutup"
                    )
                }
            }
        } catch (error) {
            SweetAlert.showAlert(
                "Oops!",
                "Terjadi Error Pada Server",
                "error",
                "Tutup"
            )
        }
    };

    const [img, setImg] = useState(
        JSON.parse(localStorage.getItem('userProfile'))?.profile_picture ||
        "https://www.shutterstock.com/image-vector/vector-illustration-color-avatar-user-260nw-2463110213.jpg"
    );

    // GANTI PROFILE IMAGE
    const handleImageClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Preview the selected image (optional)
            setImg(URL.createObjectURL(file));

            // Prepare the file for upload
            const formData = new FormData();
            formData.append("profile_picture", file);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/auth/update-profile-picture/`, {
                    method: "POST",
                    headers: {
                        // Add Authorization header if needed
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    // Assuming the updated image URL is returned in the response
                    const data = await response.json();
                    setImg(data.profile_picture_url); // Update image in the component
                    SweetAlert.showAlert(
                        "Berhasil!",
                        "Foto Profil Berhasil Diperbarui",
                        "success",
                        "Ok"
                    ).then(() => {// Update the profile_picture field with the new URL
                        if (userProfile) {
                            userProfile.profile_picture = data.profile_picture_url;
                            localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        }
                        navigate("/", { replace: true });
                    });
                } else {
                    SweetAlert.showAlert(
                        "Oops!",
                        "Gagal Memperbarui Foto Profil",
                        "error",
                        "Tutup"
                    )
                }
            } catch (error) {
                SweetAlert.showAlert(
                    "Oops!",
                    "Terjadi Kesalahan Pada Server, Silahkan Coba Beberapa Saat Lagi",
                    "error",
                    "Tutup"
                )
            }
        }
    };

    return (
        <section className="section">
            <div className="section-header">
                <h1>Profil</h1>
            </div>
            <div className="section-body">
                <h2 className="section-title">Hi, {nama}!</h2>
                <p className="section-lead">
                    Ubah Informasi Data Diri Kamu Disini.
                </p>
                <div className="row mt-sm-4">
                    <div className="col-12 col-md-12 col-lg-5">
                        <div className="card profile-widget">
                            <div className="profile-widget-header">
                                <img
                                    alt="profile"
                                    src={img}
                                    className="rounded-circle profile-widget-picture"
                                    onClick={handleImageClick} // Trigger file input on click
                                    style={{ cursor: "pointer" }} // Make it look clickable
                                />
                                {/* Hidden file input */}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="profile-widget-description">
                                <div className="profile-widget-name">
                                    {nama_lengkap}
                                    <div className="text-muted d-inline font-weight-normal">
                                        <div className="slash" /> {role}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <form onSubmit={handlePasswordUpdate} className="needs-validation" noValidate>
                                    <div className="card-header">
                                        <h4>Ubah Password</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group col-md-12 col-12">
                                                <label>Password Saat Ini</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-12 col-12">
                                                <label>Password Baru</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-12 col-12">
                                                <label>Konfirmasi Password Baru</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary">Update Password</button>
                                        {feedbackMessage && (
                                            <p className="mt-2 text-danger">{feedbackMessage}</p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-7">
                        <div className="card">
                            <form className="needs-validation" noValidate>
                                <div className="card-header">
                                    <h4>Biodata</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="form-group col-md-6 col-12">
                                            <label>Nama Depan</label>
                                            <input type="text" className="form-control" defaultValue={nama} readOnly />
                                        </div>
                                        <div className="form-group col-md-6 col-12">
                                            <label>Nama Belakang</label>
                                            <input type="text" className="form-control" defaultValue={nama2} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-6 col-12">
                                            <label>Email</label>
                                            <input type="email" className="form-control" defaultValue={email} readOnly />
                                        </div>
                                        <div className="form-group col-md-6 col-12">
                                            <label>Phone</label>
                                            <input type="tel" className="form-control" defaultValue={hp} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-6 col-12">
                                            <label>Tanggal Lahir</label>
                                            <input type="date" className="form-control" defaultValue={tgl_lahir} readOnly />
                                        </div>
                                        <div className="form-group col-md-6 col-12">
                                            <label>Nomor Induk Mahasiswa</label>
                                            <input type="text" className="form-control" defaultValue={username} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfilPage;
