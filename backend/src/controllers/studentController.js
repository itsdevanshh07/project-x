const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const TestSeries = require('../models/TestSeries');
const LiveClass = require('../models/LiveClass');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
exports.getStudentProfile = async (req, res, next) => {
    try {
        const student = await User.findById(req.user._id)
            .populate('enrolledCourses')
            .populate('purchasedTests')
            .populate('wishlist.itemId')
            .populate('cart.itemId');

        // Ensure arrays are initialized for older user documents
        if (student) {
            student.enrolledCourses = student.enrolledCourses || [];
            student.purchasedTests = student.purchasedTests || [];
            student.wishlist = student.wishlist || [];
            student.cart = student.cart || [];
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
exports.updateStudentProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.avatar = req.body.avatar || user.avatar;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/student/cart
// @access  Private/Student
exports.addToCart = async (req, res, next) => {
    try {
        const { itemId, itemType } = req.body;
        const user = await User.findById(req.user._id);

        const alreadyInCart = user.cart.find(item => item.itemId.toString() === itemId);
        if (alreadyInCart) {
            return res.status(400).json({ message: 'Item already in cart' });
        }

        user.cart.push({ itemId, itemType });
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/student/cart/:id
// @access  Private/Student
exports.removeFromCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => item.itemId.toString() !== req.params.id);
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to wishlist
// @route   POST /api/student/wishlist
// @access  Private/Student
exports.addToWishlist = async (req, res, next) => {
    try {
        const { itemId, itemType } = req.body;
        const user = await User.findById(req.user._id);

        const alreadyInWishlist = user.wishlist.find(item => item.itemId.toString() === itemId);
        if (alreadyInWishlist) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        user.wishlist.push({ itemId, itemType });
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/student/wishlist/:id
// @access  Private/Student
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(item => item.itemId.toString() !== req.params.id);
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Get purchased courses and progress
// @route   GET /api/student/my-courses
// @access  Private/Student
exports.getMyCourses = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('enrolledCourses');

        // Combine enrolled courses with progress and active live sessions
        const myCourses = await Promise.all(user.enrolledCourses.map(async (course) => {
            const progress = user.courseProgress.find(p => p.courseId.toString() === course._id.toString());

            // Check for active live session
            const activeLive = await LiveClass.findOne({
                course: course._id,
                status: 'live'
            }).select('_id title');

            return {
                ...course._doc,
                progress: progress ? progress.percentage : 0,
                lastWatched: progress ? progress.lastWatched : null,
                currentLiveId: activeLive ? activeLive._id : null
            };
        }));

        res.json(myCourses);
    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress
// @route   POST /api/student/progress
// @access  Private/Student
exports.updateProgress = async (req, res, next) => {
    try {
        const { courseId, lessonId, percentage } = req.body;
        const user = await User.findById(req.user._id);

        let progress = user.courseProgress.find(p => p.courseId.toString() === courseId);

        if (progress) {
            progress.percentage = percentage;
            progress.lastWatched = lessonId;
        } else {
            user.courseProgress.push({
                courseId,
                percentage,
                lastWatched: lessonId
            });
        }

        await user.save();
        res.status(200).json({ message: 'Progress updated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order history
// @route   GET /api/student/orders
// @access  Private/Student
exports.getOrderHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};
const { watermarkPDF } = require('../utils/pdfWatermark');
const Lesson = require('../models/Lesson');

// @desc    Download watermarked notes
// @route   GET /api/student/download-notes/:lessonId
// @access  Private/Student
exports.downloadNotes = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson || !lesson.pdfUrl) {
            return res.status(404).json({ message: 'Notes not found' });
        }

        // Check if student is enrolled in the course
        const user = await User.findById(req.user._id);
        if (!user.enrolledCourses.includes(lesson.course)) {
            return res.status(403).json({ message: 'You are not enrolled in this course' });
        }

        const watermarkedPdfBytes = await watermarkPDF(lesson.pdfUrl, {
            email: user.email,
            fullName: user.fullName
        });

        res.contentType("application/pdf");
        res.send(Buffer.from(watermarkedPdfBytes));
    } catch (error) {
        next(error);
    }
};
