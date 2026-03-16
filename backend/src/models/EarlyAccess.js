const mongoose = require('mongoose');

const earlyAccessSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    studentClass: {
        type: String,
        required: [true, 'Class is required'],
        enum: ['5', '6', '7', '8', '9', '10', '11', '12']
    },
    parentPhone: {
        type: String,
        required: [true, 'Parent phone is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EarlyAccess', earlyAccessSchema);
