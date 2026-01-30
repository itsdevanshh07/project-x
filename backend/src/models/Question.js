const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Please add question text']
    },
    questionImage: String,
    options: [{
        optionText: {
            type: String,
            required: true
        },
        optionImage: String
    }],
    correctAnswer: [{
        type: Number, // indices of correct options
        required: true
    }],
    explanation: String,
    subject: String,
    topic: String,
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    marksPositive: {
        type: Number,
        default: 1
    },
    marksNegative: {
        type: Number,
        default: 0.25
    },
    language: {
        type: String,
        enum: ['english', 'hindi', 'bilingual'],
        default: 'bilingual'
    }
});

module.exports = mongoose.model('Question', questionSchema);
