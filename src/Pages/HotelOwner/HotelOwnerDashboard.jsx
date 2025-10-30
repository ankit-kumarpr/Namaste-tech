import React from 'react';
import './hotelowner.css';

const HotelOwnerDashboard = () => {
  return (
    <div className="hotelowner-dashboard">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Hotel Owner Dashboard</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="info-box">
                      <span className="info-box-icon bg-info">
                        <i className="fas fa-hotel"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Hotel Name</span>
                        <span className="info-box-number">Your Hotel</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-box">
                      <span className="info-box-icon bg-success">
                        <i className="fas fa-calendar-check"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Bookings</span>
                        <span className="info-box-number">0</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-box">
                      <span className="info-box-icon bg-warning">
                        <i className="fas fa-star"></i>
                      </span>
                      <div className="info-box-content">
                        <span className="info-box-text">Rating</span>
                        <span className="info-box-number">0.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5>Welcome to Your Hotel Management System</h5>
                      </div>
                      <div className="card-body">
                        <p>Manage your hotel bookings, services, and customer relationships from this dashboard.</p>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="list-group">
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-bed me-2"></i>
                                Manage Rooms
                              </a>
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-calendar-alt me-2"></i>
                                View Bookings
                              </a>
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-users me-2"></i>
                                Customer Management
                              </a>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="list-group">
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-chart-line me-2"></i>
                                Analytics & Reports
                              </a>
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-cog me-2"></i>
                                Hotel Settings
                              </a>
                              <a href="#" className="list-group-item list-group-item-action">
                                <i className="fas fa-bell me-2"></i>
                                Notifications
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerDashboard;
