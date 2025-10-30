import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function NavAvatar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get user initial from name
  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout function using auth context
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <div>
      {/* Avatar Button to Open Menu */}
      <IconButton onClick={handleMenuOpen} style={{ padding: "20px" }}>
        <Avatar>{getUserInitial()}</Avatar>
      </IconButton>

      {/* MUI Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
      >
        {/* User Info */}
        {user && user.name && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user.name}
            </Typography>
          </MenuItem>
        )}
        
        {/* Logout Option */}
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ marginRight: 1, color: "red" }} />
          <Typography color="error">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default NavAvatar;
