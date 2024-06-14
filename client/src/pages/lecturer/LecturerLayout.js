import React from 'react'
import { Outlet } from 'react-router-dom'

function LecturerLayout() {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default LecturerLayout