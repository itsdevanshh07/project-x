const TestSeries = require('../models/TestSeries');

// @desc    Get all test series
// @route   GET /api/test-series
// @access  Public
exports.getTestSeries = async (req, res, next) => {
    try {
        const testSeries = await TestSeries.find();
        res.json(testSeries);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single test series
// @route   GET /api/test-series/:id
// @access  Public
exports.getTestSeriesById = async (req, res, next) => {
    try {
        const testSeries = await TestSeries.findById(req.params.id).populate('tests.questions');
        if (!testSeries) return res.status(404).json({ message: 'Test series not found' });
        res.json(testSeries);
    } catch (error) {
        next(error);
    }
};

// @desc    Create test series
// @route   POST /api/test-series
// @access  Private/Admin
exports.createTestSeries = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const testSeries = await TestSeries.create(req.body);
        res.status(201).json(testSeries);
    } catch (error) {
        next(error);
    }
};
