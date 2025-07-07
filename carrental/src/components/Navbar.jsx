import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success('You are now an owner');
        navigate('/owner/manage-cars');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle navigation for List Cars / Become Owner
  const handleListCarsOrDashboard = () => {
    if (isOwner) {
      navigate('/owner/manage-cars');
    } else {
      changeRole();
    }
    setOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor transition-all ${
        location.pathname === "/" && "bg-white"
      }`}
    >
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      <button onClick={() => setOpen(!open)} className="lg:hidden">
        <img src={assets.menu_icon} alt="menu" />
      </button>

      <div
        className={`
        fixed sm:static top-16 right-0 w-full sm:w-auto h-screen sm:h-auto
        flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-4 sm:p-0
        transition-all duration-300 z-50
        ${location.pathname === "/" ? "bg-white" : "bg-light"}
        ${open ? "translate-x-0" : "translate-x-full"} sm:translate-x-0
      `}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search product"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            className="cursor-pointer"
            onClick={handleListCarsOrDashboard}
          >
            {isOwner ? "List Cars" : "Become Owner"}
          </button>
          <button
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            onClick={() => {
              if (user) {
                logout();
              } else {
                setShowLogin(true);
              }
              setOpen(false);
            }}
          >
            {user ? user.name : "Login"}
          </button>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden">
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
