const PYQ = require('../models/PYQ');

// @desc    Get all PYQs
// @route   GET /api/pyq
// @access  Public
exports.getPYQs = async (req, res, next) => {
    try {
        const pyqs = await PYQ.find().sort({ year: -1 });
        res.json(pyqs);
    } catch (error) {
        next(error);
    }
};

// @desc    Create PYQ
// @route   POST /api/pyq
// @access  Private/Admin
exports.createPYQ = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const pyq = await PYQ.create(req.body);
        res.status(201).json(pyq);
    } catch (error) {
        next(error);
    }
};
