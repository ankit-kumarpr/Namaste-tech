import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./addhotel.css";

const EditHotel = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotelData, setHotelData] = useState({
    hotelName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    GST: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  // Mock hotel data
  useEffect(() => {
    setLoading(true);
    
    // Mock data
    setTimeout(() => {
      setHotelData({
        hotelName: "Demo Hotel",
        street: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        landmark: "Near Park",
        GST: "27AABCU9603R1ZM",
        image: null
      });
      
      setLoading(false);
    }, 500);
  }, [hotelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotelData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setSubmitting(true);

    console.log("Hotel update data:", hotelData);

    // Mock update
    setTimeout(() => {
      toast.success("Hotel updated successfully!");
      setSubmitting(false);
      navigate("/self-hotel");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="add-hotel-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-hotel-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="main-card">
              <div className="card-header">
                <div className="header-content">
                  <div className="title-section">
                    <h3 className="card-title">
                      <i className="bi bi-pencil"></i>
                      Edit Hotel
                    </h3>
                    <p className="card-subtitle">
                      Update your hotel information
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate("/self-hotel")}
                  >
                    <i className="bi bi-arrow-left"></i> Back to Hotels
                  </button>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit} className="hotel-form">
                  {/* First Row - 3 fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="hotelName">Hotel Name *</label>
                      <input
                        type="text"
                        id="hotelName"
                        name="hotelName"
                        value={hotelData.hotelName}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter hotel name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="GST">GST Number</label>
                      <input
                        type="text"
                        id="GST"
                        name="GST"
                        value={hotelData.GST}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter GST number (optional)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="landmark">Landmark</label>
                      <input
                        type="text"
                        id="landmark"
                        name="landmark"
                        value={hotelData.landmark}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter landmark (optional)"
                      />
                    </div>
                  </div>

                  {/* Second Row - 3 fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="street">Street Address *</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={hotelData.street}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={hotelData.city}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={hotelData.state}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* Third Row - 2 fields (pincode and image) */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={hotelData.pincode}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="image">Hotel Image</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="form-control"
                      />
                      {imagePreview && (
                        <div className="image-preview-small">
                          <img src={imagePreview} alt="Hotel preview" />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      {/* Empty space to maintain grid structure */}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate("/self-hotel")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="spinner-small"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check"></i>
                          Update Hotel
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;