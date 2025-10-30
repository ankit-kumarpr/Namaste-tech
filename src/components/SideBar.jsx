import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { IoGridOutline } from "react-icons/io5";
import { FaHotel, FaBed, FaCalendarAlt, FaUsers, FaChartLine, FaCog, FaBell, FaUserShield, FaPlus, FaList, FaCogs, FaChevronDown, FaChevronRight, FaSignOutAlt, FaEdit, FaMoneyBillWave, FaBoxes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SideBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  let role = user?.role || "";
  
  const [dropdowns, setDropdowns] = useState({
    hotels: false,
    bulkEdit: false,
  });

  const [selectedHotel, setSelectedHotel] = useState(null);

  // Check for selected hotel on mount and when localStorage changes
  useEffect(() => {
    const hotel = localStorage.getItem('selectedHotel');
    setSelectedHotel(hotel);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const hotel = localStorage.getItem('selectedHotel');
      setSelectedHotel(hotel);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleDropdown = (name) => {
    setDropdowns({ ...dropdowns, [name]: !dropdowns[name] });
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedHotel');
    logout();
    navigate('/');
  };

  // Show loading if user data is not available
  if (!user) {
    return (
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <div className="nav-link">
              <span className="nav-heading collapsed">Loading...</span>
            </div>
          </li>
        </ul>
      </aside>
    );
  }

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {role === "hotelowner" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Dashboard</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("hotels")}
              >
                <FaHotel size={20} />
                <span className="nav-heading collapsed">Hotels</span>
              </div>
              {dropdowns.hotels && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-hotel" className="nav-link">
                      <FaPlus size={16} />
                      <span className="nav-heading collapsed">Add Hotel</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/self-hotel" className="nav-link">
                      <FaList size={16} />
                      <span className="nav-heading collapsed">Your Hotels</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/add-hotelroom" className="nav-link">
                      <FaPlus size={16} />
                      <span className="nav-heading collapsed">Add Room</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaBed size={20} />
                <span className="nav-heading collapsed">Manage Rooms</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaCalendarAlt size={20} />
                <span className="nav-heading collapsed">Bookings</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaUsers size={20} />
                <span className="nav-heading collapsed">Customers</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaChartLine size={20} />
                <span className="nav-heading collapsed">Analytics</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaCog size={20} />
                <span className="nav-heading collapsed">Settings</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaBell size={20} />
                <span className="nav-heading collapsed">Notifications</span>
              </Link>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/admin-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Dashboard</span>
              </Link>
            </li>
            
            {/* Show hotel options if a hotel is selected */}
            {selectedHotel && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/rooms">
                    <FaBed size={20} />
                    <span className="nav-heading collapsed">Rooms</span>
                  </Link>
                </li>
                
                <li className="nav-item">
                  <div
                    className="nav-link"
                    onClick={() => toggleDropdown("bulkEdit")}
                    style={{ cursor: 'pointer' }}
                  >
                    <FaEdit size={20} />
                    <span className="nav-heading collapsed">Bulk Edit</span>
                  </div>
                  {dropdowns.bulkEdit && (
                    <ul className="nav-content">
                      <li className="ps-3">
                        <Link to="/rate-edit" className="nav-link">
                          <span className="nav-heading collapsed">Rate Edit</span>
                        </Link>
                      </li>
                      <li className="ps-3">
                        <Link to="/inventory" className="nav-link">
                          <span className="nav-heading collapsed">Inventory</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/reservation">
                    <FaCalendarAlt size={20} />
                    <span className="nav-heading collapsed">Reservation</span>
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/price-update">
                    <FaMoneyBillWave size={20} />
                    <span className="nav-heading collapsed">Price Change</span>
                  </Link>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <div className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff6b6b' }}>
                <FaSignOutAlt size={20} />
                <span className="nav-heading collapsed">Logout</span>
              </div>
            </li>
          </>
        )}

        {role === "team" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Dashboard</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/self-hotel">
                <FaHotel size={20} />
                <span className="nav-heading collapsed">View Hotels</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaBed size={20} />
                <span className="nav-heading collapsed">Manage Rooms</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaCalendarAlt size={20} />
                <span className="nav-heading collapsed">Bookings</span>
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/hotelowner-dashboard">
                <FaUsers size={20} />
                <span className="nav-heading collapsed">Customers</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
