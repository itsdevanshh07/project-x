const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: {
            values: ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'JEE', 'NEET', 'Board Exam'],
            message: '{VALUE} is not a valid academic category'
        }
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        type: String,
        default: 'no-thumbnail.jpg'
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discountedPrice: {
        type: Number
    },
    validity: {
        type: Number, // in days
        required: [true, 'Please add validity in days'],
        min: [1, 'Validity must be at least 1 day']
    },
    features: [String],
    tags: [String],
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete modules when a course is deleted
courseSchema.pre('remove', async function () {
    await this.model('Module').deleteMany({ course: this._id });
});

// Reverse populate with virtuals
courseSchema.virtual('modules', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});

// Update the updatedAt field on save
courseSchema.pre('save', function () {
    this.updatedAt = Date.now();
});


module.exports = mongoose.model('Course', courseSchema);
