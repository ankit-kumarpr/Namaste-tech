import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./hotelslist.css";

const Hotelslist = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [approvingHotel, setApprovingHotel] = useState(null);

  // Mock data for demo
  useEffect(() => {
    setHotels([
      {
        _id: "1",
        hotelName: "Demo Hotel 1",
        address: {
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          landmark: "Near Park"
        },
        GST: "27AABCU9603R1ZM",
        owner: {
          name: "John Doe",
          email: "john@example.com",
          phone: "9876543210"
        },
        status: "pending",
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        hotelName: "Demo Hotel 2",
        address: {
          street: "456 Park Avenue",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
          landmark: "Near Metro Station"
        },
        GST: "07ABCDE1234F1Z5",
        owner: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "9876543211"
        },
        status: "approved",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  // Filter hotels based on search term and status
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.address?.city || hotel.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.address?.state || hotel.state || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || hotel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (hotelId) => {
    setApprovingHotel(hotelId);
    console.log("Approving hotel with ID:", hotelId);
    
    // Mock approve
    setTimeout(() => {
      setHotels(hotels.map(hotel => 
        hotel._id === hotelId ? { ...hotel, status: "approved" } : hotel
      ));
      toast.success("Hotel approved successfully!");
      setApprovingHotel(null);
    }, 1000);
  };

  const handleRejectClick = (hotel) => {
    setSelectedHotel(hotel);
    setRejectionNote("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionNote.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    // Mock reject
    setHotels(hotels.map(hotel => 
      hotel._id === selectedHotel._id 
        ? { ...hotel, status: "rejected", rejectionNote } 
        : hotel
    ));
    
    toast.success("Hotel rejected successfully!");
    setShowRejectModal(false);
    setSelectedHotel(null);
    setRejectionNote("");
  };

  const handleCloseModal = () => {
    setShowRejectModal(false);
    setSelectedHotel(null);
    setRejectionNote("");
  };

  return (
    <div className="hotels-list-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="main-card">
              <div className="card-header">
                <div className="header-content">
                  <div className="title-section">
                    <h3 className="card-title">
                      <i className="bi bi-building"></i>
                      All Hotels
                    </h3>
                    <p className="card-subtitle">
                      Manage hotel approvals and reviews
                    </p>
                  </div>
                  <div className="hotel-count">
                    <span className="count-number">
                      {filteredHotels.length}
                    </span>
                    <span className="count-label">Total Hotels</span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Search and Filter Section */}
                <div className="search-filter-section">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search hotels by name, city, or state..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-section">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="status-filter"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {filteredHotels.length === 0 ? (
                  <div className="no-hotels">
                    <div className="no-hotels-icon">
                      <i className="bi bi-building"></i>
                    </div>
                    <h4>No Hotels Found</h4>
                    <p>
                      {searchTerm || statusFilter !== "all"
                        ? "No hotels match your search criteria."
                        : "No hotels are pending approval yet."}
                    </p>
                  </div>
                ) : (
                  <div className="hotels-grid">
                    {filteredHotels.map((hotel) => (
                      <div key={hotel._id} className="hotel-card">
                        <div className="hotel-image">
                          {hotel.image ? (
                            <>
                              <img
                                src={`http://localhost:6500/${hotel.image.replace(/\\/g, "/")}`}
                                alt={hotel.hotelName}
                                className="hotel-img"
                                onError={(e) => {
                                  console.log('Image failed to load:', e.target.src);
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', hotel.image);
                                }}
                              />
                              <div className="no-image" style={{display: 'none'}}>
                                <i className="bi bi-building"></i>
                                <span>Image Not Available</span>
                              </div>
                            </>
                          ) : (
                            <div className="no-image">
                              <i className="bi bi-building"></i>
                              <span>No Image</span>
                            </div>
                          )}
                          <div className="status-badge">
                            <span
                              className={`status ${hotel.status || "pending"}`}
                            >
                              {hotel.status || "Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="hotel-content">
                          <div className="hotel-header">
                            <h4 className="hotel-name">{hotel.hotelName}</h4>
                            <div className="hotel-address-header">
                              <p className="hotel-address-text">
                                {hotel.address?.street || hotel.street}, {hotel.address?.city || hotel.city}, {hotel.address?.state || hotel.state} - {hotel.address?.pincode || hotel.pincode}
                              </p>
                              {hotel.address?.landmark || hotel.landmark ? (
                                <p className="hotel-landmark">
                                  <i className="bi bi-geo-alt"></i>
                                  {hotel.address?.landmark || hotel.landmark}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="hotel-details">
                            {hotel.GST && (
                              <div className="detail-item">
                                <i className="bi bi-receipt"></i>
                                <span>GST: {hotel.GST}</span>
                              </div>
                            )}

                            <div className="detail-item">
                              <i className="bi bi-person"></i>
                              <span>Owner: {hotel.owner?.name || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                              <i className="bi bi-envelope"></i>
                              <span>{hotel.owner?.email || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                              <i className="bi bi-telephone"></i>
                              <span>{hotel.owner?.phone || "N/A"}</span>
                            </div>

                            <div className="detail-item">
                              <i className="bi bi-calendar"></i>
                              <span>Added: {new Date(hotel.createdAt).toLocaleDateString()}</span>
                            </div>

                            {hotel.rejectionNote && (
                              <div className="detail-item rejection-note">
                                <i className="bi bi-exclamation-triangle"></i>
                                <div className="rejection-content">
                                  <span className="rejection-label">Rejection Reason:</span>
                                  <span className="rejection-text">{hotel.rejectionNote}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="hotel-actions">
                              <button className="btn btn-outline btn-sm">
                                <i className="bi bi-eye"></i> View
                              </button>
                              {hotel.status !== 'approved' && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleApprove(hotel._id)}
                                    disabled={approvingHotel === hotel._id}
                                  >
                                    {approvingHotel === hotel._id ? (
                                      <>
                                        <div className="spinner-small"></div>
                                        Approving...
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-check-lg"></i> Approve
                                      </>
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRejectClick(hotel)}
                                  >
                                    <i className="bi bi-x-lg"></i> Reject
                                  </button>
                                </>
                              )}
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Reject Hotel</h4>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="hotel-info">
                <h5>{selectedHotel?.hotelName}</h5>
                <p>
                  {selectedHotel?.address?.street || selectedHotel?.street}, 
                  {selectedHotel?.address?.city || selectedHotel?.city}, 
                  {selectedHotel?.address?.state || selectedHotel?.state}
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="rejectionNote">Rejection Reason *</label>
                <textarea
                  id="rejectionNote"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Please provide a reason for rejection (e.g., KYC documents are incomplete, missing required information, etc.)"
                  rows={4}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleRejectSubmit}
              >
                Reject Hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotelslist;
