import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Admin/hoteldata/hotelslist.css";

const Yourhotel = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data for my hotels
    setHotels([
      {
        _id: "1",
        hotelName: "My Hotel 1",
        address: {
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          landmark: "Near Park"
        },
        GST: "27AABCU9603R1ZM",
        status: "approved",
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        hotelName: "My Hotel 2",
        address: {
          street: "456 Park Avenue",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
          landmark: "Near Metro Station"
        },
        GST: "07ABCDE1234F1Z5",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  const handleEdit = (hotelId) => {
    navigate(`/edit-hotel/${hotelId}`);
  };

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
                      Your Hotels
                    </h3>
                    <p className="card-subtitle">
                      Manage your hotel listings
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
                        : "You haven't added any hotels yet."}
                    </p>
                    <a href="/add-hotel" className="btn btn-primary">
                      <i className="bi bi-plus"></i> Add Your First Hotel
                    </a>
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
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEdit(hotel._id)}
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            {hotel.status === 'rejected' && (
                              <button className="btn btn-success btn-sm">
                                <i className="bi bi-arrow-clockwise"></i> Resubmit
                              </button>
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
    </div>
  );
};

export default Yourhotel;