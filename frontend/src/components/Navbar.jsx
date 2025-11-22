import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">HAMS</Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Randevu Al</Link>
                    <Link to="/randevu/listesi" className="nav-link">Randevularım</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
