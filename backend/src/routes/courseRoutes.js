const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    createModule,
    getModulesByCourse,
    updateModule,
    deleteModule,
    createLesson,
    getLessonsByModule,
    updateLesson,
    deleteLesson
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('teacher', 'admin'), updateCourse);

// Modules
router.post('/modules', protect, authorize('teacher', 'admin'), createModule);
router.get('/:courseId/modules', getModulesByCourse);
router.route('/modules/:id')
    .put(protect, authorize('teacher', 'admin'), updateModule)
    .delete(protect, authorize('teacher', 'admin'), deleteModule);

// Lessons
router.post('/lessons', protect, authorize('teacher', 'admin'), createLesson);
router.get('/modules/:moduleId/lessons', getLessonsByModule);
router.route('/lessons/:id')
    .put(protect, authorize('teacher', 'admin'), updateLesson)
    .delete(protect, authorize('teacher', 'admin'), deleteLesson);

module.exports = router;
