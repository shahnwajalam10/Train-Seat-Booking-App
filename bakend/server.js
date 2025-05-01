const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes')

dotenv.config();
const app = express();

app.use(cors({
  origin: "https://train-seat-booking-app-ebl5.vercel.app/",
  credentials: true
}));

  


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);


// connecting to Mongodb
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
