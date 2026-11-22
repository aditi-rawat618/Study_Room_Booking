const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },

    roomNumber: {
        type: String,
        required: true,
        unique: true
    },

    capacity: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ['Study Room', 'Lab'],
        required: true
    },

    facilities: {
        type: [String],
        default: []
    },

    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);