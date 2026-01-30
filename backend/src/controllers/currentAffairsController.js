const CurrentAffairs = require('../models/CurrentAffairs');

// @desc    Get all current affairs
// @route   GET /api/current-affairs
// @access  Public
exports.getCurrentAffairs = async (req, res, next) => {
    try {
        const currentAffairs = await CurrentAffairs.find().sort({ date: -1 });
        res.json(currentAffairs);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single current affairs
// @route   GET /api/current-affairs/:id
// @access  Public
exports.getCurrentAffairsById = async (req, res, next) => {
    try {
        const currentAffairs = await CurrentAffairs.findById(req.params.id);
        if (!currentAffairs) return res.status(404).json({ message: 'Current affairs not found' });
        res.json(currentAffairs);
    } catch (error) {
        next(error);
    }
};

// @desc    Create current affairs
// @route   POST /api/current-affairs
// @access  Private/Admin
exports.createCurrentAffairs = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const currentAffairs = await CurrentAffairs.create(req.body);
        res.status(201).json(currentAffairs);
    } catch (error) {
        next(error);
    }
};
