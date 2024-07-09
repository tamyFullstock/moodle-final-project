// src/components/Navbar.js
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import '../../style/home/navbar.css'
import logo from '../../assets/logo.png';
import {useAuth, useSetAuth} from '../../helpers/ThemeProvider.js'
import Globals from '../../Globals';

//if user authorized: show 3 buttons: details, courses, logout
//unauthorized user: only login button
  function Navbar({ isAuthenticated}) {

    const port = Globals.PORT_SERVER;
    axios.defaults.withCredentials = true;  // Make it possible to use cookies
    const user = JSON.parse(localStorage.getItem('user'??{})); //get current user from ls;

    // The user unauthorized by default. Meaning did not login
    // Is the user authorized
    const setAuth = useSetAuth();
    const auth = useAuth();

    // Logout the user
    const handleLogout = () => {
      setAuth(false);
      axios.get(`http://localhost:${port}/logout`)
        .then(() => {
          localStorage.removeItem("user"); // Remove user data from local storage on logout
          window.location.reload();
        })
        .catch(err => console.log(err));
    };

    return (
      <header>
            <img className = "Logo-Moodle" src={logo} alt="Logo"/>
            <h1>moodle</h1>
            <nav>
              {isAuthenticated ? (
              <>
                <Link to={`/`}>Home</Link>
                <Link to={`/${user.type}/${user.id}/details?observer=self`}>My Details</Link>
                <Link to={`/${user.type}/${user.id}/courses`}>My Courses</Link>
                {user.type == "student" && 
                <Link to={`/${user.type}/${user.id}/tasks`}>My Tasks</Link>
                }
                <Link to = "./" onClick={handleLogout}>Logout</Link>
              </>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </nav>
        </header>
    );
  }

  export default Navbar;
  