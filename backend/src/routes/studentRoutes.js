const express = require('express');
const router = express.Router();
const {
    getStudentProfile,
    updateStudentProfile,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    getMyCourses,
    updateProgress,
    getOrderHistory
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are for students only
router.use(protect);
router.use(authorize('student'));

router.route('/profile')
    .get(getStudentProfile)
    .put(updateStudentProfile);

router.route('/cart')
    .post(addToCart);

router.route('/cart/:id')
    .delete(removeFromCart);

router.route('/wishlist')
    .post(addToWishlist);

router.route('/wishlist/:id')
    .delete(removeFromWishlist);

router.get('/my-courses', getMyCourses);
router.post('/progress', updateProgress);
router.get('/orders', getOrderHistory);
router.get('/download-notes/:lessonId', require('../controllers/studentController').downloadNotes);

module.exports = router;
