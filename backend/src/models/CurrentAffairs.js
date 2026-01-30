const mongoose = require('mongoose');

const currentAffairsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['National', 'International', 'Sports', 'Science', 'Economy', 'Other']
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
    },
    pdfUrl: {
        type: String
    },
    isFree: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('CurrentAffairs', currentAffairsSchema);
