const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null/missing values despite being unique
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved' // Default for students
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    avatar: {
        type: String,
        default: 'no-photo.jpg'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    enrolledCourses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    }],
    purchasedTests: [{
        type: mongoose.Schema.ObjectId,
        ref: 'TestSeries'
    }],
    cart: [{
        itemType: {
            type: String,
            enum: ['Course', 'TestSeries', 'Material']
        },
        itemId: {
            type: mongoose.Schema.ObjectId,
            refPath: 'cart.itemType'
        }
    }],
    wishlist: [{
        itemType: {
            type: String,
            enum: ['Course', 'TestSeries', 'Material']
        },
        itemId: {
            type: mongoose.Schema.ObjectId,
            refPath: 'wishlist.itemType'
        }
    }],
    courseProgress: [{
        courseId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        },
        percentage: {
            type: Number,
            default: 0
        },
        lastWatched: String // Lecture ID or Title
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    isSocial: {
        type: Boolean,
        default: false
    },
    socialProvider: {
        type: String,
        enum: ['google', 'microsoft', null],
        default: null
    },
    socialId: {
        type: String,
        unique: true,
        sparse: true
    },
    // Teacher specific fields
    bio: {
        type: String,
        default: ""
    },
    expertise: [{
        type: String
    }],
    experience: {
        type: Number,
        default: 0
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
