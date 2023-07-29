import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
      <img src="./images/_dc60e290-fcc0-4027-b199-a862e83d4645.jfif" alt="Logo" className="logo" />
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/tasks" className="nav-link">Tasks</Link>
        </li>
        <li className="navbar-item">
          <Link to="/users" className="nav-link">Users</Link>
        </li>
        <li className="navbar-item">
          <Link to="/projects" className="nav-link">Projects</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
