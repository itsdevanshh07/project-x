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
        required: [true, 'Please add a scheduled date']
    },
    dayOfWeek: {
        type: String,
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        uppercase: true
    },
    startTime: {
        type: String, // format "HH:mm"
        trim: true
    },
    endTime: {
        type: String, // format "HH:mm"
        trim: true
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
        type: String
    },
    joinUrl: {
        type: String
    },
    startUrl: {
        type: String // Hidden for students
    },
    playbackId: {
        type: String // Mux Playback ID
    },
    streamKey: {
        type: String // Mux Stream Key (Private)
    },
    muxStreamId: {
        type: String
    },
    recordingUrl: {
        type: String
    },
    platform: {
        type: String,
        enum: ['mux', 'zoom', 'internal'],
        default: 'mux'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
