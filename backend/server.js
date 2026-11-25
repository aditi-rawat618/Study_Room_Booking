const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const bookingRoutes = require('./routes/bookingroutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB();

// Home route
app.get('/', (req, res) => {
    res.send('Lab/Study Room Booking System Server is running!');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working successfully!'
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});