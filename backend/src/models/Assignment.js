const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    fileUrl: {
        type: String // Link to the assignment document
    },
    dueDate: {
        type: Date
    },
    maxMarks: {
        type: Number,
        default: 100
    },
    submissions: [{
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        fileUrl: String,
        submittedAt: {
            type: Date,
            default: Date.now
        },
        marks: Number,
        feedback: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
