// src/pages/NotFound.js
import React from 'react';

const NotFound = () => {
    return (
        <section className="section">
            <div className="container mt-5">
                <div className="page-error">
                    <div className="page-inner">
                        <h1>404</h1>
                        <div className="page-description">
                            Halaman Yang Kamu Cari Tidak Ditemukan.
                        </div>
                        <div className="page-search">

                            <div className="mt-3">
                                <a href="/">Ke Halaman Utama</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="simple-footer mt-5">
                    Copyright © Siskuring 2024
                </div>
            </div>
        </section>

    );
};

export default NotFound;
