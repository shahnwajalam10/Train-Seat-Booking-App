import React, { useState } from 'react';

const Dashboard = () => {
  // Initialize 80 seats: 11 rows of 7 seats + 1 row of 3 seats
  const initializeSeats = () => {
    const seats = [];
    for (let row = 1; row <= 11; row++) {
      for (let seat = 1; seat <= 7; seat++) {
        seats.push({ row, seat, booked: false });
      }
    }
    
    // Last row with 3 seats
    for (let seat = 1; seat <= 3; seat++) {
      seats.push({ row: 12, seat, booked: false });
    }
    return seats;
  };

  const [seats, setSeats] = useState(initializeSeats());
  const [numSeats, setNumSeats] = useState('');
  const [message, setMessage] = useState('');

  // Find available seats in one row
  const findSeatsInRow = (count) => {
    for (let row = 1; row <= 12; row++) {
      const rowSeats = seats.filter(s => s.row === row && !s.booked);
      const maxSeats = row === 12 ? 3 : 7;
      if (rowSeats.length >= count && count <= maxSeats) {
        return rowSeats.slice(0, count);
      }
    }
    return null;
  };

  // Find nearby seats across rows
  const findNearbySeats = (count) => {
    const available = seats.filter(s => !s.booked);
    if (available.length < count) return null;

    // Sort by row and seat for proximity
    available.sort((a, b) => {
      if (a.row === b.row) return a.seat - b.seat;
      return a.row - b.row;
    });

    // Check for nearby seats
    const selected = [];
    let currentRow = available[0].row;
    let rowSeats = [];

    for (let seat of available) {
      if (seat.row === currentRow) {
        rowSeats.push(seat);
      } else {
        if (rowSeats.length > 0) {
          selected.push(...rowSeats);
          if (selected.length >= count) break;
        }
        currentRow = seat.row;
        rowSeats = [seat];
      }
    }
    if (rowSeats.length > 0) selected.push(...rowSeats);

    return selected.length >= count ? selected.slice(0, count) : null;
  };

  // Handle booking
  const handleBook = () => {
    const count = parseInt(numSeats);
    if (isNaN(count) || count < 1 || count > 7) {
      setMessage('Please enter a number between 1 and 7.');
      return;
    }

    // Try to book in one row first
    let selectedSeats = findSeatsInRow(count);

    // If not possible, find nearby seats
    if (!selectedSeats) {
      selectedSeats = findNearbySeats(count);
    }

    if (selectedSeats) {
      const newSeats = seats.map(seat => {
        if (selectedSeats.some(s => s.row === seat.row && s.seat === seat.seat)) {
          return { ...seat, booked: true };
        }
        return seat;
      });
      setSeats(newSeats);
      setMessage(`Booked ${count} seats: ${selectedSeats.map(s => `Row ${s.row}-Seat ${s.seat}`).join(', ')}`);
      setNumSeats(''); // Clear input after booking
    } else {
      setMessage('Not enough seats available.');
    }
  };

  // Reset all bookings
  const handleReset = () => {
    setSeats(initializeSeats());
    setNumSeats('');
    setMessage('All bookings reset.');
  };

  // Render seats for a row
  const renderRow = (rowNum) => {
    const rowSeats = seats.filter(s => s.row === rowNum);
    return (
      <div className="flex space-x-2">
        {rowSeats.map(seat => (
          <div
            key={`${seat.row}-${seat.seat}`}
            className={`w-10 h-10 flex items-center justify-center border rounded transition-colors duration-300 ${
              seat.booked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {seat.seat}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Train Seat Booking Dashboard</h1>
      
      {/* Seat Selection */}
      <div className="mb-4 flex items-center">
        <label className="mr-2">Number of seats (1-7):</label>
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
          className="border p-1 rounded w-16"
          placeholder="e.g., 3"
        />
        <button
          onClick={handleBook}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book Seats
        </button>
        <button
          onClick={handleReset}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {message}
        </div>
      )}

      {/* Seat Layout */}
      <div className="grid gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="flex items-center">
            <span className="w-16">Row {index + 1}</span>
            {renderRow(index + 1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;