import React, { useState, useEffect } from 'react';
import hotelsData from '../../database/hotels.json';
import './admin.css';

const RateEdit = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dates, setDates] = useState([]);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [bulkPrice, setBulkPrice] = useState({});

  useEffect(() => {
    // Get selected hotel from localStorage
    const hotelName = localStorage.getItem('selectedHotel');
    setSelectedHotel(hotelName);

    if (hotelName) {
      // Find hotel data
      const hotel = hotelsData.hotels.find(h => h.name === hotelName);
      if (hotel && hotel.rooms) {
        const roomsData = hotel.rooms;
        setRooms(roomsData);
        
        // Load saved prices from localStorage if exist
        const savedPrices = localStorage.getItem(`prices_${hotelName}`);
        if (savedPrices) {
          setPriceUpdates(JSON.parse(savedPrices));
        }

        // Set default date range to current month
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        // Start date: today
        setStartDate(`${year}-${month}-${day}`);
        
        // End date: last day of current month
        const endDateObj = new Date(year, parseInt(month), 0);
        const lastDay = endDateObj.getDate();
        const lastMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
        const lastYear = endDateObj.getFullYear();
        setEndDate(`${lastYear}-${lastMonth}-${String(lastDay).padStart(2, '0')}`);
      }
    }
  }, []);

  // Generate dates between start and end date
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end >= start) {
        const dateArray = [];
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
          dateArray.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setDates(dateArray);
      } else {
        setDates([]);
      }
    }
  }, [startDate, endDate]);

  const handlePriceChange = (roomId, date, newPrice) => {
    const price = parseFloat(newPrice) || 0;
    
    // Update price updates
    setPriceUpdates({
      ...priceUpdates,
      [`${roomId}-${date}`]: price
    });
  };

  const handleBulkPriceChange = (roomId, price) => {
    setBulkPrice({
      ...bulkPrice,
      [roomId]: price
    });
  };

  const applyBulkPrice = (roomId) => {
    const price = parseFloat(bulkPrice[roomId]) || 0;
    
    if (price > 0 && dates.length > 0) {
      const newUpdates = { ...priceUpdates };
      
      dates.forEach(date => {
        const key = `${roomId}-${date}`;
        newUpdates[key] = price;
      });
      
      setPriceUpdates(newUpdates);
      setBulkPrice({ ...bulkPrice, [roomId]: '' });
    }
  };

  const handleSaveAll = () => {
    console.log('Saving all price updates:', priceUpdates);
    
    // Save to localStorage
    if (selectedHotel) {
      localStorage.setItem(`prices_${selectedHotel}`, JSON.stringify(priceUpdates));
    }
    
    alert('Price updates saved successfully!');
  };

  if (!selectedHotel) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Please select a hotel first to edit rates.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ padding: '20px' }}>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="text-dark mb-3 mb-md-0">Rate Edit - {selectedHotel}</h4>
              <div className="d-flex gap-2 flex-wrap">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  style={{ width: 'auto', minWidth: '150px' }}
                />
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  style={{ width: 'auto', minWidth: '150px' }}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveAll}
                  disabled={Object.keys(priceUpdates).length === 0}
                >
                  <i className="fas fa-save me-2"></i>
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {dates.length === 0 ? (
          <div className="alert alert-info">
            Please select a date range to proceed.
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              {rooms.length === 0 ? (
                <div className="alert alert-info">
                  No rooms available for this hotel.
                </div>
              ) : (
                <>
                  <div className="table-responsive mb-4">
                    <h6 className="mb-3">Apply Same Price to All Dates</h6>
                    <div className="row">
                      {rooms.map((room) => (
                        <div key={room.id} className="col-md-6 col-lg-3 mb-3">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title text-dark">{room.roomType}</h6>
                               <div className="input-group">
                                 <span className="input-group-text" style={{ fontSize: '12px' }}>₹</span>
                                 <input
                                   type="number"
                                   className="form-control"
                                   value={bulkPrice[room.id] || ''}
                                   onChange={(e) => handleBulkPriceChange(room.id, e.target.value)}
                                   placeholder={room.price}
                                   style={{ fontSize: '12px', minWidth: '60px' }}
                                 />
                                 <button
                                   className="btn btn-success btn-sm"
                                   onClick={() => applyBulkPrice(room.id)}
                                   disabled={!bulkPrice[room.id] || bulkPrice[room.id] <= 0}
                                 >
                                   Apply
                                 </button>
                               </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="align-middle" style={{ minWidth: '150px' }}>Room Type</th>
                          {dates.map((date) => (
                            <th key={date} className="text-center" style={{ minWidth: '120px' }}>
                              <div className="fw-bold small">{date}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.id}>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-bed me-2 text-primary"></i>
                                <strong>{room.roomType}</strong>
                              </div>
                            </td>
                            {dates.map((date) => {
                              const key = `${room.id}-${date}`;
                              const updatedPrice = priceUpdates[key];
                              const originalPrice = room.price;
                              const currentPrice = updatedPrice !== undefined ? updatedPrice : originalPrice;
                              const isChanged = updatedPrice !== undefined && updatedPrice !== originalPrice;
                              
                              return (
                                 <td key={date} className="align-middle">
                                   <div className="input-group" style={{ minWidth: '120px' }}>
                                     <span className="input-group-text" style={{ fontSize: '12px' }}>₹</span>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={currentPrice}
                                       onChange={(e) => handlePriceChange(room.id, date, e.target.value)}
                                       min="0"
                                       style={{ 
                                         fontWeight: isChanged ? 'bold' : 'normal',
                                         backgroundColor: isChanged ? '#d4edda' : 'white',
                                         fontSize: '12px'
                                       }}
                                     />
                                   </div>
                                 </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateEdit;

