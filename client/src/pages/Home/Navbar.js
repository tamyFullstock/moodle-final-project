// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/home/navbar.css'
import logo from '../../assets/logo.png'

//if user authorized: show 3 buttons: details, courses, logout
//unauthorized user: only login button
  function Navbar({ isAuthenticated, onLogout }) {

    return (
      <header>
            <img className = "Logo-Moodle" src={logo} alt="Logo"/>
            <h1>moodle</h1>
            <nav>
              {isAuthenticated ? (
              <>
                <Link to="/lecturer/details">My Details</Link>
                <Link to="/lecturer/courses">My Courses</Link>
                <Link to = "./" onClick={onLogout}>Logout</Link>
              </>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </nav>
        </header>
    );
  }

  export default Navbar;
  