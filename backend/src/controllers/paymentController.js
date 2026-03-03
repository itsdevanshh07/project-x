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

        const razorpayOrder = await razorpay.orders.create(options);

        // Create pending order in our database
        await Order.create({
            user: req.user._id,
            items: [{
                itemType: 'Course',
                itemId: courseId,
                price: course.discountedPrice || course.price
            }],
            totalAmount: course.discountedPrice || course.price,
            orderId: razorpayOrder.id,
            paymentId: 'pending', // Will be updated after payment
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder
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
            // Find and update the existing pending order
            const order = await Order.findOne({ orderId: razorpay_order_id });

            if (order && order.status !== 'completed') {
                order.status = 'completed';
                order.paymentId = razorpay_payment_id;
                await order.save();

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
            } else if (order && order.status === 'completed') {
                res.status(200).json({
                    success: true,
                    message: 'Payment already verified',
                    order
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }
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

// @desc    Handle Razorpay Webhook
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res, next) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment.captured' || event === 'order.paid') {
            const payment = payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;

            // Find order in database
            const order = await Order.findOne({ orderId });

            if (order && order.status !== 'completed') {
                order.status = 'completed';
                order.paymentId = paymentId;
                await order.save();

                // Grant access to student for each item in the order
                for (const item of order.items) {
                    if (item.itemType === 'Course') {
                        await User.findByIdAndUpdate(order.user, {
                            $addToSet: { enrolledCourses: item.itemId }
                        });
                        await Course.findByIdAndUpdate(item.itemId, {
                            $inc: { enrollmentCount: 1 }
                        });
                    }
                }
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
