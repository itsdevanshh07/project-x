const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    testId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    testSeriesId: {
        type: mongoose.Schema.ObjectId,
        ref: 'TestSeries',
        required: true
    },
    responses: [{
        questionId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Question'
        },
        selectedAnswer: [Number],
        isCorrect: Boolean,
        timeSpent: Number, // in seconds
        markedForReview: {
            type: Boolean,
            default: false
        }
    }],
    totalMarks: Number,
    obtainedMarks: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    unattempted: Number,
    percentile: Number,
    rank: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    },
    timeTaken: Number // total time in seconds
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
