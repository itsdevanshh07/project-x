const express = require('express');
const router = express.Router();
const {
    getCurrentAffairs,
    getCurrentAffairsById,
    createCurrentAffairs
} = require('../controllers/currentAffairsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCurrentAffairs)
    .post(protect, authorize('admin', 'teacher'), createCurrentAffairs);

router.route('/:id')
    .get(getCurrentAffairsById);

module.exports = router;
