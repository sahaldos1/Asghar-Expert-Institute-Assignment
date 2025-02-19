import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Coin Tracker
      </Link>
      <Link to="/wallet" className="nav-wallet-button">
        My Wallet
      </Link>
    </nav>
  );
};

export default Navbar;
