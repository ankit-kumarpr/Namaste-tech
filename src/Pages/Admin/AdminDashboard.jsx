import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hotelsData from '../../database/hotels.json';
import reservationsData from '../../database/reservations.json';
import './admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    todayCheckins: 0,
    todayCheckouts: 0,
    revenue: 0
  });

  useEffect(() => {
    const hotel = localStorage.getItem('selectedHotel');
    setSelectedHotel(hotel);

    if (hotel) {
      // Find hotel data
      const hotelInfo = hotelsData.hotels.find(h => h.name === hotel);
      setHotelData(hotelInfo);

      // Filter reservations for this hotel
      const hotelReservations = reservationsData.reservations.filter(
        r => r.hotelName === hotel
      );
      setReservations(hotelReservations);

      // Calculate stats
      if (hotelInfo) {
        const totalRooms = hotelInfo.rooms.reduce((sum, room) => sum + room.totalRooms, 0);
        const totalBookings = hotelReservations.length;
        const today = new Date().toISOString().split('T')[0];
        const todayCheckins = hotelReservations.filter(r => r.checkIn === today).length;
        const todayCheckouts = hotelReservations.filter(r => r.checkOut === today).length;
        const revenue = hotelReservations
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + r.totalPrice, 0);

        setStats({
          totalRooms,
          totalBookings,
          todayCheckins,
          todayCheckouts,
          revenue
        });
      }
    }
  }, []);

  const handleDemoHotelClick = () => {
    console.log("Demo Hotel clicked");
    setSelectedHotel('Demo Hotel');
    localStorage.setItem('selectedHotel', 'Demo Hotel');
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeselect = () => {
    setSelectedHotel(null);
    localStorage.removeItem('selectedHotel');
    window.dispatchEvent(new Event('storage'));
  };

  // Show hotel detail view when a hotel is selected
  if (selectedHotel && hotelData) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-12">
              <div style={{ position: 'relative' }}>
                <h4 className="text-dark" style={{  marginBottom: '0' }}>
                  Hotel Dashboard - {selectedHotel}
                </h4>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={handleDeselect}
                  style={{ 
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    width: '60px',
                    
                  }}
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Back
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row mb-4 pt-2">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#e3f2fd' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-bed fa-2x text-primary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-0">Total Rooms</h6>
                      <h3 className="mb-0">{stats.totalRooms}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#f3e5f5' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-calendar-check fa-2x text-purple"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-0">Total Bookings</h6>
                      <h3 className="mb-0">{stats.totalBookings}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#e8f5e9' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-sign-in-alt fa-2x text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-0">Today Check-ins</h6>
                      <h3 className="mb-0">{stats.todayCheckins}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#fff3e0' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-rupee-sign fa-2x text-warning"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-0">Revenue</h6>
                      <h3 className="mb-0">₹{stats.revenue.toLocaleString()}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <i className="fas fa-bolt text-primary me-2"></i>
                    Quick Actions
                  </h5>
                  <div className="row g-2">
                    <div className="col-md-3 col-sm-6">
                      <button 
                        className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center py-2"
                        onClick={() => navigate('/rooms')}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-bed me-2"></i>
                        Manage Rooms
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <button 
                        className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center py-2"
                        onClick={() => navigate('/reservation')}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-calendar-alt me-2"></i>
                        View Reservations
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <button 
                        className="btn btn-outline-info btn-sm w-100 d-flex align-items-center justify-content-center py-2"
                        onClick={() => navigate('/price-update')}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Update Prices
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <button 
                        className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center py-2"
                        onClick={() => navigate('/inventory')}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-boxes me-2"></i>
                        Inventory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ position: 'relative' }}>
                    <h5 className="card-title mb-3" style={{ textAlign: 'center' }}>
                      <i className="fas fa-list text-primary me-2"></i>
                      Recent Bookings
                    </h5>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/reservation')}
                      style={{ 
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        width: '70px',
                       
                      }}
                    >
                      View All
                    </button>
                  </div>
                  {reservations.length > 0 ? (
                    <div className="table-responsive pt-2">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Booking ID</th>
                            <th>Guest Name</th>
                            <th>Room Type</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.slice(0, 5).map((reservation) => (
                            <tr key={reservation.id}>
                              <td>
                                <strong className="text-primary">{reservation.bookingId}</strong>
                              </td>
                              <td>{reservation.guestName}</td>
                              <td>
                                <span className="badge bg-secondary">{reservation.roomType}</span>
                              </td>
                              <td>{reservation.checkIn}</td>
                              <td>{reservation.checkOut}</td>
                              <td>
                                <span className={`badge ${reservation.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
                                  {reservation.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">No recent bookings found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show hotel list when no hotel is selected
  return (
    <div className="admin-dashboard" style={{ padding: '20px' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 mb-4">
            <h4 className="text-dark">Select a Hotel</h4>
          </div>
          <div className="col-md-4 col-sm-6 mb-4">
            <div 
              className="card demo-hotel-card" 
              onClick={handleDemoHotelClick}
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
                border: '1px solid #e0e0e0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#01a2a6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="card-body text-center" style={{ padding: '15px' }}>
                <i className="fas fa-hotel" style={{ fontSize: '32px', color: '#01a2a6', marginBottom: '10px' }}></i>
                <h5 className="card-title mb-0 text-dark">Demo Hotel</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;