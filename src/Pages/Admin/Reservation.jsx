import React, { useState, useEffect } from 'react';
import reservationsData from '../../database/reservations.json';
import './admin.css';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Get selected hotel from localStorage
    const hotelName = localStorage.getItem('selectedHotel');
    setSelectedHotel(hotelName);

    if (hotelName) {
      // Filter reservations for selected hotel
      const hotelReservations = reservationsData.reservations.filter(
        r => r.hotelName === hotelName
      );
      setReservations(hotelReservations);
    }
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'success', text: 'Confirmed' },
      pending: { bg: 'warning', text: 'Pending' },
      cancelled: { bg: 'danger', text: 'Cancelled' },
      completed: { bg: 'info', text: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`badge bg-${config.bg}`}>
        {config.text}
      </span>
    );
  };

  if (!selectedHotel) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Please select a hotel first to view reservations.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="text-dark">Reservations - {selectedHotel}</h4>
            </div>
          </div>

          {reservations.length === 0 ? (
            <div className="alert alert-info">
              No reservations found for this hotel.
            </div>
          ) : (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Bookings: {reservations.length}</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Booking ID</th>
                        <th>Guest Name</th>
                        <th>Room Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReservations.map((reservation) => (
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
                          <td>{getStatusBadge(reservation.status)}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleViewDetails(reservation)}
                            >
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                          key={page}
                          className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}

                <div className="text-center text-muted mt-2">
                  Showing {startIndex + 1} to {Math.min(endIndex, reservations.length)} of {reservations.length} bookings
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Booking Details */}
      {showModal && selectedReservation && (
        <div 
          className="modal fade show" 
          style={{ display: 'block' }} 
          tabIndex="-1"
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{ maxHeight: '90vh', marginTop: '20px', marginBottom: '20px' }}
          >
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header bg-primary text-white" style={{ flexShrink: 0 }}>
                <h5 className="modal-title">Booking Details - {selectedReservation.bookingId}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body" style={{ overflowY: 'auto', flex: '1 1 auto' }}>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Guest Information</h6>
                    <p><strong>Name:</strong> {selectedReservation.guestName}</p>
                    <p><strong>Email:</strong> {selectedReservation.contactEmail}</p>
                    <p><strong>Phone:</strong> {selectedReservation.contactPhone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Booking Information</h6>
                    <p><strong>Booking ID:</strong> {selectedReservation.bookingId}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedReservation.status)}</p>
                    <p><strong>Booking Date:</strong> {new Date(selectedReservation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Stay Details</h6>
                    <p><strong>Room Type:</strong> {selectedReservation.roomType}</p>
                    <p><strong>Number of Rooms:</strong> {selectedReservation.numberOfRooms}</p>
                    <p><strong>Check-in:</strong> {selectedReservation.checkIn}</p>
                    <p><strong>Check-out:</strong> {selectedReservation.checkOut}</p>
                    <p><strong>Total Nights:</strong> {selectedReservation.totalNights}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Guest Details</h6>
                    <p><strong>Adults:</strong> {selectedReservation.adults}</p>
                    <p><strong>Children:</strong> {selectedReservation.children}</p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <h6 className="border-bottom pb-2">Pricing</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>Price per Night</td>
                          <td className="text-end">₹{selectedReservation.pricePerNight}</td>
                        </tr>
                        <tr>
                          <td>Number of Nights</td>
                          <td className="text-end">{selectedReservation.totalNights}</td>
                        </tr>
                        <tr>
                          <td>Number of Rooms</td>
                          <td className="text-end">{selectedReservation.numberOfRooms}</td>
                        </tr>
                        <tr className="table-primary">
                          <td><strong>Total Amount</strong></td>
                          <td className="text-end"><strong>₹{selectedReservation.totalPrice}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedReservation.specialRequests && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="border-bottom pb-2">Special Requests</h6>
                      <p className="text-muted">{selectedReservation.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reservation;

