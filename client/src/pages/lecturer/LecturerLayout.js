import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Home/Navbar'

function LecturerLayout() {
  return (
    <div>
      <Navbar isAuthenticated={true}/>
      <Outlet />
    </div>
  )
}

export default LecturerLayout