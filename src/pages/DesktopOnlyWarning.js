import React, { useEffect, useState } from 'react';

const DesktopOnlyWarning = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDesktop) return null; // Don't display the message on desktop devices

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f8f9fa',
            color: '#333',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            textAlign: 'center',
            padding: '20px',
        }}>
            <section className="section">
                <div className="container mt-5">
                    <div className="page-error">
                        <div className="page-inner">
                            <img className='img-fluid' src='https://i.ibb.co.com/qJzCrgM/desktop-computer-rafiki.png'></img >
                            <h3>Oops!</h3>
                            <div className="page-description">
                                Halaman Yang Kamu Maksud Hanya Bisa Diakses Via Desktop (PC / Laptop).
                            </div>
                        </div>
                    </div>
                    <div className="simple-footer mt-5">
                        Copyright © Siskuring 2024
                    </div>
                </div>
            </section>

        </div>
    );
};

export default DesktopOnlyWarning;
