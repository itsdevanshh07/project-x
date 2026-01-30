const mongoose = require('mongoose');

const liveChatMessageSchema = new mongoose.Schema({
    liveClass: {
        type: mongoose.Schema.ObjectId,
        ref: 'LiveClass',
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LiveChatMessage', liveChatMessageSchema);
