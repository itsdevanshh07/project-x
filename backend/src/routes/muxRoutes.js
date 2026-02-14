const express = require('express');
const router = express.Router();
const {
    createUpload,
    createLiveClass,
    handleWebhook,
    addDoubtMeeting
} = require('../controllers/muxController');
const { protect, authorize, checkApproved } = require('../middleware/authMiddleware');

// Public Webhook (Mux sends this)
router.post('/webhook', handleWebhook);

// Protected Routes
router.use(protect);
router.use(authorize('teacher', 'admin'));
router.use(checkApproved);

router.post('/upload', createUpload);
router.post('/live', createLiveClass);
router.post('/doubt-meeting', addDoubtMeeting);

module.exports = router;
