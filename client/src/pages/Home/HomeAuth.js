// src/components/HomeAuth.js
import React from 'react';
import Navbar from './Navbar';
import '../../style/home/homeAuth.css'
import { Link } from 'react-router-dom';

function HomeAuth({ user}) {
  return (
    <div className="containerHome">
      <Navbar isAuthenticated={true}/>
      <div className='body-home'>
        <h1>Welcome {user?.first_name}</h1>
        <h6>nice to see you again</h6>
        <Link to = "./1/upload" >upload</Link>
      </div>
    </div>
  );
}

export default HomeAuth;