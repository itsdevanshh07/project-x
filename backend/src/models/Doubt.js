const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    lecture: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lecture'
    },
    question: {
        type: String,
        required: [true, 'Please add your doubt/question']
    },
    attachments: [String], // URLs to images/files
    status: {
        type: String,
        enum: ['pending', 'answered', 'closed'],
        default: 'pending'
    },
    answers: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        text: String,
        attachments: [String],
        answeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doubt', doubtSchema);
