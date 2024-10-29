import React from 'react';
import moment from 'moment';
import { useLocation, Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
const Header = ({ onLogout }) => {
    const location = useLocation();
    // Retrieve user profile from local storage
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const role = userProfile ? userProfile.role : null; // Get the user's role
    const id_user = userProfile ? String(userProfile.id) : null; // Convert the user's ID to a string

    const nama = userProfile ? userProfile.first_name : null; // Get the user's role
    const last_login = userProfile ? userProfile.last_login : null; // Get the user's role
    var img = userProfile ? userProfile.profile_picture : null; // Get the user's rolev
    // Access the secret key from environment variables


    if (img == null) {
        img = "https://www.shutterstock.com/image-vector/vector-illustration-color-avatar-user-260nw-2463110213.jpg";
    }
    const dateTimeAgo = moment(new Date(last_login)).fromNow();


    const hashId = (password) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    };

    const id_hashed = hashId(id_user);

    const sidebarItemsMhs = [
        { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
        { path: '/kelas', label: 'Kelas', icon: 'fas fa-chalkboard-teacher' },
        { path: '/absensi', label: 'Absensi', icon: 'fas fa-calendar-check' },
        { path: '/pesan', label: 'Pesan', icon: 'fas fa-comment-dots' },
        { path: '/forum-diskusi/' + id_hashed, label: 'Forum Diskusi (Aktif)', icon: 'fas fa-comments' },
    ];


    const sidebarItemsDsn = [
        { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
        { path: '/dosen/kelas', label: 'Kelas', icon: 'fas fa-chalkboard-teacher' },
        { path: '/dosen/absensi', label: 'Absensi', icon: 'fas fa-calendar-check' },
        { path: '/dosen/pesan', label: 'Pesan', icon: 'fas fa-comment-dots' },
        { path: '/forum-diskusi/' + id_hashed, label: 'Forum Diskusi (Aktif)', icon: 'fas fa-comments' },
    ];

    const sidebarItemsAdmin = [
        { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
        { path: '/manajemen-fakultas', label: 'Kelola Fakultas', icon: 'fas fa-chalkboard-teacher' },
        { path: '/manajemen-prodi', label: 'Kelola Prodi', icon: 'fas fa-chalkboard-teacher' },
        { path: '/manajemen-akun', label: 'Kelola Pengguna', icon: 'fas fa-chalkboard-teacher' },
        { path: '/manajemen-kelas', label: 'Kelola Kelas', icon: 'fas fa-chalkboard-teacher' },
        { path: '/manajemen-pengumuman', label: 'Kelola Pengumuman', icon: 'fas fa-comments' },
    ];
    return (

        <>
            <nav className="navbar navbar-expand-lg main-navbar bg-primary">
                <form className="form-inline mr-auto">
                    <ul className="navbar-nav mr-3">
                        <li><a href="#" data-toggle="sidebar" className="nav-link nav-link-lg"><i className="fas fa-bars" /></a></li>
                    </ul>
                </form>
                <ul className="navbar-nav navbar-right">
                    <li className="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown" className="nav-link notification-toggle nav-link-lg beep"><i className="far fa-bell" /></a>
                        <div className="dropdown-menu dropdown-list dropdown-menu-right">
                            <div className="dropdown-header">Notifications
                                <div className="float-right">
                                    <a href="#">Mark All As Read</a>
                                </div>
                            </div>
                            <div className="dropdown-list-content dropdown-list-icons">
                                <a href="#" className="dropdown-item dropdown-item-unread">
                                    <div className="dropdown-item-icon bg-primary text-white">
                                        <i className="fas fa-code" />
                                    </div>
                                    <div className="dropdown-item-desc">
                                        Template update is available now!
                                        <div className="time text-primary">2 Min Ago</div>
                                    </div>
                                </a>
                                <a href="#" className="dropdown-item">
                                    <div className="dropdown-item-icon bg-info text-white">
                                        <i className="far fa-user" />
                                    </div>
                                    <div className="dropdown-item-desc">
                                        <b>You</b> and <b>Dedik Sugiharto</b> are now friends
                                        <div className="time">10 Hours Ago</div>
                                    </div>
                                </a>
                                <a href="#" className="dropdown-item">
                                    <div className="dropdown-item-icon bg-success text-white">
                                        <i className="fas fa-check" />
                                    </div>
                                    <div className="dropdown-item-desc">
                                        <b>Kusnaedi</b> has moved task <b>Fix bug header</b> to <b>Done</b>
                                        <div className="time">12 Hours Ago</div>
                                    </div>
                                </a>
                                <a href="#" className="dropdown-item">
                                    <div className="dropdown-item-icon bg-danger text-white">
                                        <i className="fas fa-exclamation-triangle" />
                                    </div>
                                    <div className="dropdown-item-desc">
                                        Low disk space. Let's clean it!
                                        <div className="time">17 Hours Ago</div>
                                    </div>
                                </a>
                                <a href="#" className="dropdown-item">
                                    <div className="dropdown-item-icon bg-info text-white">
                                        <i className="fas fa-bell" />
                                    </div>
                                    <div className="dropdown-item-desc">
                                        Welcome to Stisla template!
                                        <div className="time">Yesterday</div>
                                    </div>
                                </a>
                            </div>
                            <div className="dropdown-footer text-center">
                                <a href="#">View All <i className="fas fa-chevron-right" /></a>
                            </div>
                        </div>
                    </li>
                    <li className="dropdown"><a href="#" data-toggle="dropdown" className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                        <img alt="image" src={img} className="rounded-circle mr-1" />
                        <div className="d-sm-none d-lg-inline-block">Hi, {nama}</div></a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <div className="dropdown-title">Logged in {dateTimeAgo}</div>
                            <Link to='/profil' className="dropdown-item has-icon">
                                <i className="far fa-user" /> Profile
                            </Link>
                            <a onClick={onLogout} className="dropdown-item has-icon text-danger">
                                <i className="fas fa-sign-out-alt" /> Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>
            <div className="main-sidebar sidebar-style-2">
                <aside id="sidebar-wrapper">
                    <div className="sidebar-brand">
                        <a href="index.html">SIKSURING</a>
                    </div>
                    <div className="sidebar-brand sidebar-brand-sm">
                        <a href="index.html">SK</a>
                    </div>
                    <ul className="sidebar-menu">
                        <li className="menu-header">Dashboard</li>
                        {role === 'superadmin' && (
                            <>
                                {sidebarItemsAdmin.map((item) => (
                                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                        <Link to={item.path} className="nav-link">
                                            <i className={item.icon} /> <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                        {role === 'manajemen' && (
                            <li className="dropdown">
                                <a href="#" className="nav-link has-dropdown"><i className="fas fa-chart-line" /><span>Management Dashboard</span></a>
                                <ul className="dropdown-menu">
                                    <li><a className="nav-link" href="management-reports.html">Reports</a></li>
                                </ul>
                            </li>
                        )}
                        {role === 'staff_prodi' && (
                            <li className="dropdown">
                                <a href="#" className="nav-link has-dropdown"><i className="fas fa-user-graduate" /><span>Program Staff Dashboard</span></a>
                                <ul className="dropdown-menu">
                                    <li><a className="nav-link" href="program-overview.html">Overview</a></li>
                                    <li><a className="nav-link" href="program-courses.html">Courses</a></li>
                                </ul>
                            </li>
                        )}
                        {role === 'dosen' && (
                            <>
                                {sidebarItemsDsn.map((item) => (
                                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                        <Link to={item.path} className="nav-link">
                                            <i className={item.icon} /> <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                        {role === 'mahasiswa' && (
                            <>
                                {sidebarItemsMhs.map((item) => (
                                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                        <Link to={item.path} className="nav-link">
                                            <i className={item.icon} /> <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </aside>
            </div></>
    );
}

export default Header;