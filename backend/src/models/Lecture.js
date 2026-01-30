const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    section: {
        type: String,
        required: [true, 'Please add a section name']
    },
    title: {
        type: String,
        required: [true, 'Please add a lecture title'],
        trim: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    duration: {
        type: String // e.g., "10:24"
    },
    pdfUrl: {
        type: String
    },
    isFree: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lecture', lectureSchema);
