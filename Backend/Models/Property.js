const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  place: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  rentPerDay: { type: Number, required: true },
  sqft: { type: Number, required: true },
  placesNear: { type: [String], required: true },  
  status: { type: String, enum: ['available', 'unavailable'], required: true },
  picture: { type: String },
  owner: { type: String },
  booking: { type: String, enum: [,'Not Booked','Applied','Pending', 'FulFilled', 'Cancelled'] },  
});

module.exports = mongoose.model('Property', propertySchema);
