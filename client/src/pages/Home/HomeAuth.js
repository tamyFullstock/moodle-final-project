// src/components/HomeAuth.js
import React from 'react';
import Navbar from './Navbar';
import '../../style/home/homeAuth.css'

function HomeAuth({ user, onLogout }) {
  return (
    <div className="containerHome">
      <Navbar onLogout={onLogout} isAuthenticated={true}/>
      <div className='body-home'>
        <h1>Welcome {user?.first_name}</h1>
        <h6>nice to see you again</h6>
      </div>
    </div>
  );
}

export default HomeAuth;