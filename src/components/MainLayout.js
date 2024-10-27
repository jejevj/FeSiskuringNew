import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children, onLogout }) => {
    return (
        <div className="main-wrapper main-wrapper-1">
            <Header onLogout={onLogout} /> {/* Pass onLogout to Header */}
            <div className="main-content">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
