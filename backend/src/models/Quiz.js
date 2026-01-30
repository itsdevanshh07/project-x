const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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
        required: [true, 'Please add a quiz title'],
        trim: true
    },
    description: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Question'
    }],
    timeLimit: {
        type: Number, // in minutes
        default: 30
    },
    totalMarks: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
