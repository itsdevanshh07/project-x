const mongoose = require('mongoose');

const testSeriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a test series title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    numberOfTests: {
        type: Number,
        default: 0
    },
    validity: {
        type: Number, // in days
        required: [true, 'Please add validity']
    },
    tests: [{
        testName: String,
        totalQuestions: Number,
        totalMarks: Number,
        duration: Number, // in minutes
        instructions: String,
        startTime: Date,
        endTime: Date,
        questions: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Question'
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestSeries', testSeriesSchema);
