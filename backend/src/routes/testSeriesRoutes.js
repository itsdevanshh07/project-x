const express = require('express');
const router = express.Router();
const {
    getTestSeries,
    getTestSeriesById,
    createTestSeries
} = require('../controllers/testSeriesController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTestSeries)
    .post(protect, authorize('admin', 'teacher'), createTestSeries);

router.route('/:id')
    .get(getTestSeriesById);

module.exports = router;
