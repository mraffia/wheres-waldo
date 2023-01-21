import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-title-link">
                <div className="nav-title">Where's Waldo</div>
            </Link>
            <ul className="nav-links">
                <Link to="/leaderboard" className="nav-link">
                    <li>Leaderboard</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;