import React from 'react'
import './logo.css';
import logo from '../images/gnet.webp'
import { CiMenuFries } from "react-icons/ci";
import { HiMenuAlt1 } from "react-icons/hi";

function Logo() {
  const handleToggleSideBar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };


  return (
    <div className='d-flex align-items-center justify-content-between'>
      <a href='/' className=' d-flex align-items-center text-decoration-none'>

        <img src={logo} alt='Grandeur Net' style={{ height: "60px", width: "auto" }} />

      </a>
      <HiMenuAlt1 className='toggle-sidebar-btn m-2' onClick={handleToggleSideBar} />

    </div>
  )
}

export default Logo
