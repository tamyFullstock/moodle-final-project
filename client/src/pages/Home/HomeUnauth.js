// src/components/HomeUnauth.js
import React from 'react';
import Navbar from './Navbar';
import '../../style/home/homeUnAuth.css'

function HomeUnauth() {
  return (
    <div className="containerHome">
      <Navbar isAuthenticated={false}/>
      <div className='body-home'>
        <h1>Welcome to Moodle App</h1>
        <h6>please log-in</h6>
      </div>
    </div>
  );
}

export default HomeUnauth;