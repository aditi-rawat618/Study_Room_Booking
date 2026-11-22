const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Add a new room
router.post('/', async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);

        res.status(201).json({
            message: 'Room added successfully!',
            room: newRoom
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;