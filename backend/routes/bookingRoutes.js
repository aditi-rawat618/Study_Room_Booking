const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('student', 'name email')
            .populate('room');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a booking
router.post('/', async (req, res) => {
    try {
        const {
            student,
            room,
            bookingDate,
            startTime,
            endTime
        } = req.body;

        if (!student || !room || !bookingDate || !startTime || !endTime) {
            return res.status(400).json({
                message: 'All booking details are required.'
            });
        }

        if (endTime <= startTime) {
            return res.status(400).json({
                message: 'End time must be later than start time.'
            });
        }

        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            room: room,
            bookingDate: new Date(bookingDate),
            status: { $ne: 'Cancelled' },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (overlappingBooking) {
            return res.status(409).json({
                message: 'This room is already booked for the selected time.'
            });
        }

        const newBooking = await Booking.create({
            student,
            room,
            bookingDate,
            startTime,
            endTime
        });

        res.status(201).json({
            message: 'Booking created successfully!',
            booking: newBooking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;