const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    examType: {
        type: String,
        required: [true, 'Please add an exam type (e.g. SSC, Railway)'],
        enum: ['SSC', 'Railway', 'Defence', 'Banking', 'State', 'Other']
    },
    year: {
        type: Number,
        required: [true, 'Please add the year']
    },
    pdfUrl: {
        type: String,
        required: [true, 'Please add a PDF URL']
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    },
    isFree: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
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

module.exports = mongoose.model('PYQ', pyqSchema);
