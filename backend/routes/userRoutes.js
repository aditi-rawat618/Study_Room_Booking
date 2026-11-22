const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register a student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered.'
            });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: 'Student registered successfully!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;