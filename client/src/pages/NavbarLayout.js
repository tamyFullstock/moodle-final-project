import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Home/Navbar'

function NavbarLayout() {
  return (
    <div>
      <Navbar isAuthenticated={true}/>
      <Outlet />
    </div>
  )
}

export default NavbarLayout