const express = require('express');
const { getTrainData, bookSeats, cancelBooking } = require('../controllers/bookingController');
const jwt = require('jsonwebtoken');


const router = express.Router();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ status: 'error', message: 'Token is required' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
    }
};

router.get('/train', authMiddleware, getTrainData);
router.post('/book', authMiddleware, bookSeats);
router.post('/cancel', authMiddleware, cancelBooking);


module.exports = router;