const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    socialLogin,
    getTeacherRequests,
    getAllTeachers,
    updateTeacherStatus,
    createAdmin,
    getAllUsers,
    getPublicTeachers
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.get('/profile', protect, getProfile);
router.get('/teachers/public', getPublicTeachers);

// Admin Routes
router.get('/teacher-requests', protect, authorize('admin'), getTeacherRequests);
router.get('/teachers', protect, authorize('admin'), getAllTeachers);
router.put('/approve-teacher/:id', protect, authorize('admin'), updateTeacherStatus);
router.post('/create-admin', protect, authorize('admin'), createAdmin);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
