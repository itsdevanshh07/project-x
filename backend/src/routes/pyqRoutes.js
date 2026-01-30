const express = require('express');
const router = express.Router();
const {
    getPYQs,
    createPYQ
} = require('../controllers/pyqController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getPYQs)
    .post(protect, authorize('admin', 'teacher'), createPYQ);

module.exports = router;
