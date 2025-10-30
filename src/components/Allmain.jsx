import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";

import "./main.css";
import PageTitle from "./PageTitle.jsx";

// Hotel Owner Dashboard
import HotelOwnerDashboard from "../Pages/HotelOwner/HotelOwnerDashboard.jsx";
// Admin Dashboard
import AdminDashboard from "../Pages/Admin/AdminDashboard.jsx";
import Hotelslist from "../Pages/Admin/hoteldata/Hotelslist.jsx";
import Rooms from "../Pages/Admin/Rooms.jsx";
import PriceUpdate from "../Pages/Admin/PriceUpdate.jsx";
import RateEdit from "../Pages/Admin/RateEdit.jsx";
import Inventory from "../Pages/Admin/Inventory.jsx";
import Reservation from "../Pages/Admin/Reservation.jsx";
import { useAuth } from "../contexts/AuthContext";
import AddHotel from "../Pages/HotelOwner/hotel/AddHotel.jsx";
import Yourhotel from "../Pages/HotelOwner/hotel/Yourhotel.jsx";
import EditHotel from "../Pages/HotelOwner/hotel/EditHotel.jsx";
import AddRoom from "../Pages/HotelOwner/rooms/AddRoom.jsx";

const Allmain = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Map routes to page titles
    const routeToTitle = {
      "/hotelowner-dashboard": "Hotel Owner Dashboard",
      "/admin-dashboard": "Admin Dashboard",
      "/add-hotel": "Add Hotel",
      "/hotels-list": "All Hotels",
      "/dashboard": "Dashboard",
      "/self-hotel": "Your Hotels",
      "/edit-hotel": "Edit Hotel",
      "/rooms": "Rooms",
      "/price-update": "Price Update",
      "/rate-edit": "Rate Edit",
      "/inventory": "Inventory",
      "/reservation": "Reservations"
    };

    const title = routeToTitle[location.pathname];
    if (title) {
      setPageTitle(title);
    } else {
      setPageTitle("");
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <SideBar />
      <main
        id="main"
        className="main"
        style={{ background: "#99dee0", height: "auto" }}
      >
        <PageTitle page={pageTitle} />
        <Routes>
          {/* Hotel Owner Dashboard */}
          <Route path="/hotelowner-dashboard" element={<HotelOwnerDashboard />} />
          <Route path="/add-hotel" element={<AddHotel />} />
          <Route path="/self-hotel" element={<Yourhotel />} />
          <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
          <Route path="/add-hotelroom" element={<AddRoom />} />
          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/hotels-list" element={<Hotelslist />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/price-update" element={<PriceUpdate />} />
          <Route path="/rate-edit" element={<RateEdit />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reservation" element={<Reservation />} />

          {/* Default dashboard route - redirect based on role */}
          <Route path="/dashboard" element={
            user?.role === "admin" ? <Navigate to="/admin-dashboard" replace /> :
            user?.role === "hotelowner" ? <Navigate to="/hotelowner-dashboard" replace /> :
            user?.role === "team" ? <Navigate to="/hotelowner-dashboard" replace /> :
            <Navigate to="/hotelowner-dashboard" replace />
          } />
        </Routes>
      </main>
    </>
  );
};

export default Allmain;