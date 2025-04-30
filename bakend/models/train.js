// const mongoose = require('mongoose');


// const seatSchema = new mongoose.Schema({
//     seatNumber: { type: String, required: true },
//     isBooked: { type: Boolean, default: false },
// });
  
// const rowSchema = new mongoose.Schema({
//     seats: { type: [seatSchema], required: true },
// });
  
// const trainSchema = new mongoose.Schema({
//     coach: { type: [rowSchema], required: true },
//     bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// });
  
// const Train = mongoose.model('Train', trainSchema);
  
// module.exports = Train;



const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const rowSchema = new mongoose.Schema({
    seats: { type: [seatSchema], required: true }
});

const trainSchema = new mongoose.Schema({
    coach: { type: [rowSchema], required: true },
    bookings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        seats: [{ type: String }]
    }]
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;