const express = require('express');
const router = express.Router();
const {
    createCourse,
    getTeacherCourses,
    updateCourse,
    deleteCourse,
    addLecture,
    getCourseLectures,
    scheduleLiveClass,
    getTeacherLiveClasses,
    updateLiveClassRecording,
    getCourseDoubts,
    answerDoubt,
    getTeacherStats,
    createTestSeries,
    getTeacherTestSeries,
    createPYQ,
    getTeacherPYQs,
    createCurrentAffairs,
    getTeacherCurrentAffairs
} = require('../controllers/teacherController');
const { protect, authorize, checkApproved } = require('../middleware/authMiddleware');

// All routes are protected: Teacher role + Approved status
router.use(protect);
router.use(authorize('teacher', 'admin'));
router.use(checkApproved);

// Course Routes
router.route('/courses')
    .post(createCourse)
    .get(getTeacherCourses);

router.route('/courses/:id')
    .put(updateCourse)
    .delete(deleteCourse);

// Lecture Routes
router.route('/lectures')
    .post(addLecture);

router.get('/courses/:courseId/lectures', getCourseLectures);

// Live Class Routes
router.route('/live-classes')
    .post(scheduleLiveClass)
    .get(getTeacherLiveClasses);

router.put('/live-classes/:id/recording', updateLiveClassRecording);

// Doubt Routes
router.get('/courses/:courseId/doubts', getCourseDoubts);
router.post('/doubts/:id/answer', answerDoubt);

// Stats
router.get('/stats', getTeacherStats);

// Test Series
router.route('/test-series')
    .post(createTestSeries)
    .get(getTeacherTestSeries);

// PYQs
router.route('/pyqs')
    .post(createPYQ)
    .get(getTeacherPYQs);

// Current Affairs
router.route('/current-affairs')
    .post(createCurrentAffairs)
    .get(getTeacherCurrentAffairs);

module.exports = router;
