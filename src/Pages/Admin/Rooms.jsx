import React, { useState, useEffect } from 'react';
import hotelsData from '../../database/hotels.json';
import './admin.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    // Get selected hotel from localStorage
    const hotelName = localStorage.getItem('selectedHotel');
    setSelectedHotel(hotelName);

    if (hotelName) {
      // Find hotel data
      const hotel = hotelsData.hotels.find(h => h.name === hotelName);
      if (hotel && hotel.rooms) {
        setRooms(hotel.rooms);
      }
    }
  }, []);

  if (!selectedHotel) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Please select a hotel first to view rooms.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ padding: '20px' }}>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="text-dark">Rooms - {selectedHotel}</h4>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="alert alert-info">
            No rooms available for this hotel.
          </div>
        ) : (
          <div className="row">
            {rooms.map((room, index) => {
              // Different colors for each card
              const colors = [
                { bg: '#e3f2fd', border: '#2196f3', icon: '#1976d2' },
                { bg: '#fff3e0', border: '#ff9800', icon: '#f57c00' },
                { bg: '#f3e5f5', border: '#9c27b0', icon: '#7b1fa2' },
                { bg: '#e8f5e9', border: '#4caf50', icon: '#388e3c' },
                { bg: '#fce4ec', border: '#e91e63', icon: '#c2185b' },
                { bg: '#e0f2f1', border: '#009688', icon: '#00796b' }
              ];
              const colorScheme = colors[index % colors.length];
              
              return (
                <div key={room.id} className="col-lg-3 col-md-6 mb-3">
                  <div 
                    className="card h-100" 
                    style={{ 
                      borderTop: `3px solid ${colorScheme.border}`,
                      backgroundColor: colorScheme.bg
                    }}
                  >
                    <div className="card-body text-center" style={{ padding: '20px' }}>
                      <i 
                        className="fas fa-bed mb-3" 
                        style={{ fontSize: '32px', color: colorScheme.icon }}
                      ></i>
                      <h6 className="card-title fw-bold mb-2 text-dark">{room.roomType}</h6>
                      <div className="mt-3">
                        <small className="text-muted d-block mb-1">Total Rooms</small>
                        <div className="fw-bold fs-5">{room.totalRooms}</div>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">Price per Room</small>
                        <div className="fw-bold fs-5 text-primary">₹{room.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;

