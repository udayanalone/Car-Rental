import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import SideBar from '../../components/owner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'
const Layout = () => {
  const {isOwner,navigate}=useAppContext();
  useEffect(()=>{
    if(!isOwner){
      navigate('/');
    }
  },[isOwner]);
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
