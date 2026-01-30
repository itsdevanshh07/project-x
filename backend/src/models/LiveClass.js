const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a class title'],
        trim: true
    },
    description: {
        type: String
    },
    scheduledTime: {
        type: Date,
        required: [true, 'Please add a scheduled time']
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'ended', 'cancelled'],
        default: 'upcoming'
    },
    meetingId: {
        type: String // For Jitsi, Zoom, or internal stream ID
    },
    recordingUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
