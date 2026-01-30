const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const amount = (course.discountedPrice || course.price) * 100; // Amount in paise

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database operations
            const course = await Course.findById(courseId);

            const order = await Order.create({
                user: req.user._id,
                items: [{
                    itemType: 'Course',
                    itemId: courseId,
                    price: course.discountedPrice || course.price
                }],
                totalAmount: course.discountedPrice || course.price,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: 'completed'
            });

            // Grant access to student
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { enrolledCourses: courseId }
            });

            // Increment enrollment count
            await Course.findByIdAndUpdate(courseId, {
                $inc: { enrollmentCount: 1 }
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                order
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
    } catch (error) {
        next(error);
    }
};
