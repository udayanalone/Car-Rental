import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import SideBar from '../../components/owner/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <SideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
