const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true
    },
    module: {
        type: mongoose.Schema.ObjectId,
        ref: 'Module',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    pdfUrl: {
        type: String
    },
    content: {
        type: String
    },
    duration: {
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
    assignment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assignment'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lesson', lessonSchema);
