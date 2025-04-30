const Train = require('../models/train');
const User = require('../models/User');

// Initialize train with 80 seats (11 rows of 7, 1 row of 3)
const initializeTrain = async () => {
    const existingTrain = await Train.findOne();
    if (existingTrain) return;

    const coach = [];
    for (let i = 1; i <= 11; i++) {
        const seats = Array.from({ length: 7 }, (_, j) => ({
            seatNumber: `${i}${String.fromCharCode(65 + j)}`
        }));
        coach.push({ seats });
    }
    const lastRowSeats = Array.from({ length: 3 }, (_, j) => ({
        seatNumber: `12${String.fromCharCode(65 + j)}`
    }));
    coach.push({ seats: lastRowSeats });

    const train = new Train({ coach, bookings: [] });
    await train.save();
    console.log('Train initialized with 80 seats');
};

// Get train and seat data
const getTrainData = async (req, res) => {
    try {
        await initializeTrain();
        const train = await Train.findOne().select('-__v');
        if (!train) {
            return res.status(404).json({ status: 'error', message: 'Train not found' });
        }

        const simplifiedSeats = train.coach.map(row => 
            row.seats.map(seat => ({
                seatNumber: seat.seatNumber,
                isBooked: seat.isBooked
            }))
        );

        res.status(200).json({ status: 'success', train, seats: simplifiedSeats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// Book seats
const bookSeats = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Please login first' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }

        const numSeats = parseInt(req.body.numSeats);
        if (!numSeats || numSeats < 1 || numSeats > 7) {
            return res.status(400).json({
                status: 'info',
                message: 'Invalid number of seats requested (1-7 allowed)'
            });
        }

        const train = await Train.findOne();
        if (!train) {
            return res.status(404).json({ status: 'error', message: 'Train not found' });
        }

        const availableSeats = findAvailableSeats(train.coach, numSeats);
        if (!availableSeats || availableSeats.length === 0) {
            return res.status(400).json({ status: 'info', message: 'No seats available' });
        }

        markSeatsAsBooked(train.coach, availableSeats, userId);
        train.bookings.push({ userId, seats: availableSeats });


        const latestBooking = train.bookings[train.bookings.length - 1];


        await train.save();

        res.status(200).json({ status: 'success', seats: availableSeats , bookingId : latestBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const { bookingId } = req.body;

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Please login first' });
        }

        const train = await Train.findOne();
        if (!train) {
            return res.status(404).json({ status: 'error', message: 'Train not found' });
        }

        const booking = train.bookings.id(bookingId);
        if (!booking || booking.userId.toString() !== userId) {
            return res.status(403).json({ status: 'error', message: 'Booking not found or unauthorized' });
        }

        const seatNumbers = booking.seats;
        for (let row of train.coach) {
            for (let seat of row.seats) {
                if (seatNumbers.includes(seat.seatNumber)) {
                    seat.isBooked = false;
                    seat.bookedBy = null;
                }
            }
        }

        train.bookings.pull(bookingId);
        await train.save();

        res.status(200).json({ status: 'success', message: 'Booking canceled', seats: seatNumbers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// Mark specific seats as booked
function markSeatsAsBooked(coach, bookedSeatNumbers, userId) {
    for (let row of coach) {
        for (let seat of row.seats) {
            if (bookedSeatNumbers.includes(seat.seatNumber)) {
                seat.isBooked = true;
                seat.bookedBy = userId;
            }
        }
    }
}

// Find available seats (prioritize single row, then nearby seats)


function findAvailableSeats(coach, numSeats) {
    const result = [];
    
    // Iterate through each row
    for (let rowIndex = 0; rowIndex < coach.length; rowIndex++) {
        const row = coach[rowIndex];
        const availableSeats = [];
        let availableCount = 0;
        
        // Collect available seats in the current row
        for (let seatIndex = 0; seatIndex < row.seats.length; seatIndex++) {
            if (!row.seats[seatIndex].isBooked) {
                availableSeats[availableCount] = row.seats[seatIndex].seatNumber;
                availableCount++;
            }
        }
        
        // If this row has enough seats, return them
        if (availableCount >= numSeats) {
            const output = [];
            for (let i = 0; i < numSeats; i++) {
                output[i] = availableSeats[i];
            }
            return output;
        }
        
        // Add available seats to result
        for (let i = 0; i < availableCount; i++) {
            result[result.length] = availableSeats[i];
        }
        
        // If we have enough seats, return them
        if (result.length >= numSeats) {
            const output = [];
            for (let i = 0; i < numSeats; i++) {
                output[i] = result[i];
            }
            return output;
        }
    }
    
    // Not enough seats found
    return [];
}


module.exports = { getTrainData, bookSeats, cancelBooking, initializeTrain };