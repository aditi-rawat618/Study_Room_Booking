const connectDB = require('./db');
const Room = require('./models/room');

const rooms = [
    {
        roomName: 'Individual Study Room',
        roomNumber: 'R101',
        capacity: 2,
        type: 'Study Room',
        facilities: ['WiFi', 'Quiet Space'],
        isAvailable: true
    },
    {
        roomName: 'Group Study Room',
        roomNumber: 'R102',
        capacity: 6,
        type: 'Study Room',
        facilities: ['WiFi', 'Whiteboard'],
        isAvailable: true
    },
    {
        roomName: 'Computer Lab',
        roomNumber: 'L101',
        capacity: 20,
        type: 'Lab',
        facilities: ['Computers', 'WiFi'],
        isAvailable: true
    }
];

async function seedRooms() {
    try {
        await connectDB();

        for (const room of rooms) {
            await Room.updateOne(
                { roomNumber: room.roomNumber },
                { $set: room },
                { upsert: true }
            );
        }

        console.log('Rooms added successfully!');
    } catch (error) {
        console.log('Error:', error.message);
    } finally {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
    }
}

seedRooms();