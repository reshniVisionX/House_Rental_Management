const express = require('express');
const Booking = require('../Models/Booking'); 
const router = express.Router();
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
    try {
        const { OwnerId, UserId, PropertyId, bookingStatus } = req.body;

        if (!OwnerId || !UserId || !PropertyId || !bookingStatus) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newBooking = new Booking({
            OwnerId,
            UserId,
            PropertyId,
            bookingStatus
        });

      
        const savedBooking = await newBooking.save();

       console.log("Booking stored");
        res.status(201).json({
            message: 'Booking created successfully.',
            booking: savedBooking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/getBookingsByOwner/:ownerId', async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: 'Invalid owner ID format' });
    }

    const ownerIdObject = new mongoose.Types.ObjectId(ownerId);

    const bookings = await Booking.find({ OwnerId: ownerIdObject });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this owner' });
    }
    console.log(bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/getBookingsByUser/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid owner ID format' });
    }

    const userIdObject = new mongoose.Types.ObjectId(userId);

    const bookings = await Booking.find({ UserId: userIdObject });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this owner' });
    }
    console.log(bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/updateStatus/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { bookingStatus } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus },
      { new: true } 
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;