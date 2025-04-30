import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainData();
  }, []);

  const fetchTrainData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const response = await axios.get('http://localhost:5000/api/booking/train', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        setTrainData(response.data.train);
        const userBookings = response.data.train.bookings.filter(
          booking => booking.userId === getUserIdFromToken(token)
        );
        setBookings(userBookings);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserIdFromToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id;
    } catch {
      return null;
    }
  };

  const handleBookSeats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const response = await axios.post(
        'http://localhost:5000/api/booking/book',
        { numSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        toast.success(`Booked ${response.data.seats.length} seats`);
        fetchTrainData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const response = await axios.post(
        'http://localhost:5000/api/booking/cancel',
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        toast.success('Booking cancelled');
        fetchTrainData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getSeatColor = (seat) => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);
    if (seat.isBooked) return seat.bookedBy === userId ? 'bg-black text-white' : 'bg-gray-400';
    return 'bg-white hover:bg-gray-100';
  };

  if (loading) {
    return <div className="h-screen flex justify-center items-center text-lg font-medium">Loading...</div>;
  }

  if (error) {
    return <div className="h-screen flex justify-center items-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-black">Train Booking Dashboard</h1>

      {/* Booking Controls */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10 border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Select Seats:</label>
            <select
              value={numSeats}
              onChange={(e) => setNumSeats(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <button
            onClick={handleBookSeats}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Book Seats
          </button>
        </div>
      </div>

      {/* Seating Chart */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10 border">
        <h2 className="text-xl font-semibold mb-6 text-black">Seating Chart</h2>
        <div className="space-y-3">
          {trainData?.coach.map((row, i) => (
            <div key={i} className="flex justify-center gap-2">
              {row.seats.map(seat => (
                <div
                  key={seat.seatNumber}
                  className={`w-10 h-10 text-sm font-semibold rounded-md flex items-center justify-center border transition ${getSeatColor(seat)}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border rounded-sm" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-sm" />
            <span>Your Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-sm" />
            <span>Booked by Others</span>
          </div>
        </div>
      </div>

      {/* User Bookings */}
      <div className="bg-white rounded-2xl shadow p-6 border">
        <h2 className="text-xl font-semibold mb-6 text-black">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">You haven't booked any seats yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="text-sm">
                  <p className="font-medium">Booking ID: {booking._id}</p>
                  <p>Seats: {booking.seats.join(', ')}</p>
                </div>
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
