const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  OwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  PropertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }, 
  bookingStatus: { type: String, enum: ['Not Booked', 'Booked', 'Pending'], required: true }, 
});

module.exports = mongoose.model('Booking', bookingSchema);
 