import React, { useState, useEffect } from 'react';
import hotelsData from '../../database/hotels.json';
import './admin.css';

const PriceUpdate = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [dates, setDates] = useState([]);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [roomPrices, setRoomPrices] = useState({});

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
      }
    }
  }, []);

  // Update dates when month changes
  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      const newDates = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month}-${String(day).padStart(2, '0')}`;
        newDates.push(date);
      }
      
      setDates(newDates);
    }
  }, [selectedMonth]);

  // Set current month as default
  useEffect(() => {
    if (!selectedMonth) {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setSelectedMonth(`${year}-${month}`);
    }
  }, [selectedMonth]);

  const handlePriceChange = (roomId, date, newPrice) => {
    const price = parseFloat(newPrice) || 0;
    
    // Update price updates
    setPriceUpdates({
      ...priceUpdates,
      [`${roomId}-${date}`]: price
    });
    
    // Update room prices state
    setRoomPrices({
      ...roomPrices,
      [roomId]: price
    });
  };

  const handleSaveAll = () => {
    console.log('Saving all price updates:', priceUpdates);
    
    // Save to localStorage
    if (selectedHotel) {
      localStorage.setItem(`prices_${selectedHotel}`, JSON.stringify(priceUpdates));
    }
    
    // Update the original rooms data
    const updatedRooms = rooms.map(room => {
      // Find if there are updates for this room
      const updatesForRoom = Object.keys(priceUpdates)
        .filter(key => key.startsWith(`${room.id}-`))
        .map(key => ({ date: key.split('-').slice(1).join('-'), price: priceUpdates[key] }));
      
      return {
        ...room,
        priceUpdates: updatesForRoom.length > 0 ? updatesForRoom : room.priceUpdates
      };
    });
    
    console.log('Updated rooms:', updatedRooms);
    alert('Price updates saved successfully!');
  };

  if (!selectedHotel) {
    return (
      <div className="admin-dashboard" style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Please select a hotel first to update prices.
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
              <h4 className="text-dark mb-3 mb-md-0">Price Update - {selectedHotel}</h4>
              <div className="d-flex gap-2 flex-wrap">
                <input
                  type="month"
                  className="form-control"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ width: 'auto', minWidth: '200px' }}
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

        <div className="card">
          <div className="card-body">
            {rooms.length === 0 ? (
              <div className="alert alert-info">
                No rooms available for this hotel.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="align-middle" style={{ minWidth: '150px' }}>Room Type</th>
                      {dates.map((date) => (
                        <th key={date} className="text-center" style={{ minWidth: '180px' }}>
                          <div className="fw-bold">{date}</div>
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
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">₹</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={currentPrice}
                                  onChange={(e) => handlePriceChange(room.id, date, e.target.value)}
                                  min="0"
                                  style={{ 
                                    fontWeight: isChanged ? 'bold' : 'normal',
                                    backgroundColor: isChanged ? '#d4edda' : 'white'
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceUpdate;

