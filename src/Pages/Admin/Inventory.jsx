import React, { useState, useEffect } from 'react';
import hotelsData from '../../database/hotels.json';
import './admin.css';

const Inventory = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dates, setDates] = useState([]);
  const [inventoryUpdates, setInventoryUpdates] = useState({});
  const [bulkInventory, setBulkInventory] = useState({});

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
        
        // Load saved inventory from localStorage if exist
        const savedInventory = localStorage.getItem(`inventory_${hotelName}`);
        if (savedInventory) {
          setInventoryUpdates(JSON.parse(savedInventory));
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

  const handleInventoryChange = (roomId, date, newInventory) => {
    const inventory = parseInt(newInventory) || 0;
    
    // Update inventory updates
    setInventoryUpdates({
      ...inventoryUpdates,
      [`${roomId}-${date}`]: inventory
    });
  };

  const handleBulkInventoryChange = (roomId, inventory) => {
    setBulkInventory({
      ...bulkInventory,
      [roomId]: inventory
    });
  };

  const applyBulkInventory = (roomId) => {
    const inventory = parseInt(bulkInventory[roomId]) || 0;
    
    if (inventory >= 0 && dates.length > 0) {
      const newUpdates = { ...inventoryUpdates };
      
      dates.forEach(date => {
        const key = `${roomId}-${date}`;
        newUpdates[key] = inventory;
      });
      
      setInventoryUpdates(newUpdates);
      setBulkInventory({ ...bulkInventory, [roomId]: '' });
    }
  };

  const handleSaveAll = () => {
    console.log('Saving all inventory updates:', inventoryUpdates);
    
    // Save to localStorage
    if (selectedHotel) {
      localStorage.setItem(`inventory_${selectedHotel}`, JSON.stringify(inventoryUpdates));
    }
    
    alert('Inventory updates saved successfully!');
  };

  if (!selectedHotel) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Please select a hotel first to edit inventory.
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
              <h4 className="text-dark mb-3 mb-md-0">Inventory - {selectedHotel}</h4>
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
                  disabled={Object.keys(inventoryUpdates).length === 0}
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
                    <h6 className="mb-3">Apply Same Inventory to All Dates</h6>
                    <div className="row">
                      {rooms.map((room) => (
                        <div key={room.id} className="col-md-6 col-lg-3 mb-3">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title text-dark">{room.roomType}</h6>
                              <small className="text-muted d-block mb-2">Total: {room.totalRooms} rooms</small>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={bulkInventory[room.id] || ''}
                                  onChange={(e) => handleBulkInventoryChange(room.id, e.target.value)}
                                  placeholder={`${room.available} available`}
                                  min="0"
                                  max={room.totalRooms}
                                  style={{ fontSize: '12px' }}
                                />
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => applyBulkInventory(room.id)}
                                  disabled={!bulkInventory[room.id] || bulkInventory[room.id] < 0}
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
                                <div>
                                  <strong>{room.roomType}</strong>
                                  <br />
                                  <small className="text-muted">Total: {room.totalRooms}</small>
                                </div>
                              </div>
                            </td>
                            {dates.map((date) => {
                              const key = `${room.id}-${date}`;
                              const updatedInventory = inventoryUpdates[key];
                              const originalInventory = room.available;
                              const currentInventory = updatedInventory !== undefined ? updatedInventory : originalInventory;
                              const isChanged = updatedInventory !== undefined && updatedInventory !== originalInventory;
                              
                              return (
                                <td key={date} className="align-middle">
                                  <div className="input-group" style={{ minWidth: '100px' }}>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={currentInventory}
                                      onChange={(e) => handleInventoryChange(room.id, date, e.target.value)}
                                      min="0"
                                      max={room.totalRooms}
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

export default Inventory;

