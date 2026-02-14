const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Lesson = require('../models/Lesson');
const LiveClass = require('../models/LiveClass');
const Doubt = require('../models/Doubt');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const TestSeries = require('../models/TestSeries');
const PYQ = require('../models/PYQ');
const CurrentAffairs = require('../models/CurrentAffairs');
const User = require('../models/User');

const muxService = require('../services/mux.service');
const zoomService = require('../services/zoom.service');
const storageService = require('../services/storage.service');

// @desc    Create a new course
// @route   POST /api/teacher/courses
// @access  Private/Teacher Approved
exports.createCourse = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all courses by teacher
// @route   GET /api/teacher/courses
// @access  Private/Teacher Approved
exports.getTeacherCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course
// @route   PUT /api/teacher/courses/:id
// @access  Private/Teacher Approved
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course
// @route   DELETE /api/teacher/courses/:id
// @access  Private/Teacher Approved
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this course' });
        }

        await course.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Add lesson to module
// @route   POST /api/teacher/lessons
// @access  Private/Teacher Approved
exports.addLesson = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const lesson = await Lesson.create({
            ...req.body,
            course: courseId,
            module: moduleId
        });

        res.status(201).json({ success: true, data: lesson });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Mux upload URL
// @route   GET /api/teacher/mux/upload-url
// @access  Private/Teacher
exports.getMuxUploadUrl = async (req, res, next) => {
    try {
        const upload = await muxService.createUploadUrl();
        res.status(200).json({ success: true, data: upload });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Storage upload URL
// @route   POST /api/teacher/storage/upload-url
// @access  Private/Teacher
exports.getStorageUploadUrl = async (req, res, next) => {
    try {
        const { fileName, contentType } = req.body;
        const data = await storageService.getUploadPresignedUrl(fileName, contentType);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all lectures for a course
// @route   GET /api/teacher/courses/:courseId/lectures
// @access  Private/Teacher Approved
exports.getCourseLectures = async (req, res, next) => {
    try {
        const lectures = await Lecture.find({ course: req.params.courseId }).sort('order');
        res.status(200).json({ success: true, count: lectures.length, data: lectures });
    } catch (error) {
        next(error);
    }
};

// LIVE CLASSES
exports.scheduleLiveClass = async (req, res, next) => {
    try {
        const { title, scheduledTime, platform, courseId } = req.body;
        req.body.instructor = req.user._id;
        req.body.course = courseId;

        if (platform === 'zoom') {
            const zoomMeeting = await zoomService.createMeeting(title, scheduledTime);
            req.body.meetingId = zoomMeeting.id.toString();
            req.body.joinUrl = zoomMeeting.joinUrl;
            req.body.startUrl = zoomMeeting.startUrl;
        } else if (platform === 'mux') {
            const muxStream = await muxService.createLiveStream();
            req.body.muxStreamId = muxStream.id;
            req.body.streamKey = muxStream.stream_key;
            req.body.playbackId = muxStream.playback_ids[0].id;
        }

        const liveClass = await LiveClass.create(req.body);
        res.status(201).json({ success: true, data: liveClass });
    } catch (error) {
        next(error);
    }
};

exports.getTeacherLiveClasses = async (req, res, next) => {
    try {
        const classes = await LiveClass.find({ instructor: req.user._id }).populate('course', 'title');
        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        next(error);
    }
};

exports.updateLiveClassRecording = async (req, res, next) => {
    try {
        const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, {
            recordingUrl: req.body.url
        }, { new: true });
        res.status(200).json({ success: true, data: liveClass });
    } catch (error) {
        next(error);
    }
};

// DOUBTS
exports.getCourseDoubts = async (req, res, next) => {
    try {
        const doubts = await Doubt.find({ course: req.params.courseId }).populate('student', 'fullName');
        res.status(200).json({ success: true, data: doubts });
    } catch (error) {
        next(error);
    }
};

exports.getAllTeacherDoubts = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);
        const doubts = await Doubt.find({ course: { $in: courseIds } })
            .populate('student', 'fullName')
            .populate('course', 'title');
        res.status(200).json({ success: true, data: doubts });
    } catch (error) {
        next(error);
    }
};

exports.answerDoubt = async (req, res, next) => {
    try {
        const doubt = await Doubt.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        doubt.answers.push({
            user: req.user._id,
            text: req.body.text,
            attachments: req.body.attachments
        });
        doubt.status = 'answered';
        await doubt.save();

        res.status(200).json({ success: true, data: doubt });
    } catch (error) {
        next(error);
    }
};

// ASSIGNMENTS
exports.createAssignment = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const assignment = await Assignment.create(req.body);
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

exports.getCourseAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        next(error);
    }
};

// QUIZZES
exports.createQuiz = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
};

exports.getCourseQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        next(error);
    }
};

// STUDENTS
exports.getEnrolledStudents = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);

        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('student', 'fullName email phone avatar')
            .populate('course', 'title');

        res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error) {
        next(error);
    }
};

// ANALYTICS
exports.getTeacherStats = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);

        const [totalStudents, totalDoubts, pendingDoubts] = await Promise.all([
            Enrollment.countDocuments({ course: { $in: courseIds } }),
            Doubt.countDocuments({ course: { $in: courseIds } }),
            Doubt.countDocuments({ course: { $in: courseIds }, status: 'pending' })
        ]);

        const totalCourses = courses.length;

        res.status(200).json({
            success: true,
            data: {
                totalCourses,
                totalStudents,
                totalDoubts,
                pendingDoubts
            }
        });
    } catch (error) {
        next(error);
    }
};

// TEST SERIES
exports.createTestSeries = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const testSeries = await TestSeries.create(req.body);
        res.status(201).json({ success: true, data: testSeries });
    } catch (error) {
        next(error);
    }
};

exports.getTeacherTestSeries = async (req, res, next) => {
    try {
        const testSeries = await TestSeries.find({ instructor: req.user._id });
        res.status(200).json({ success: true, data: testSeries });
    } catch (error) {
        next(error);
    }
};

// PYQs
exports.createPYQ = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const pyq = await PYQ.create(req.body);
        res.status(201).json({ success: true, data: pyq });
    } catch (error) {
        next(error);
    }
};

exports.getTeacherPYQs = async (req, res, next) => {
    try {
        const pyqs = await PYQ.find({ instructor: req.user._id });
        res.status(200).json({ success: true, data: pyqs });
    } catch (error) {
        next(error);
    }
};

// CURRENT AFFAIRS
exports.createCurrentAffairs = async (req, res, next) => {
    try {
        req.body.instructor = req.user._id;
        const currentAffairs = await CurrentAffairs.create(req.body);
        res.status(201).json({ success: true, data: currentAffairs });
    } catch (error) {
        next(error);
    }
};

exports.getTeacherCurrentAffairs = async (req, res, next) => {
    try {
        const currentAffairs = await CurrentAffairs.find({ instructor: req.user._id });
        res.status(200).json({ success: true, data: currentAffairs });
    } catch (error) {
        next(error);
    }
};
// PROFILE
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            fullName: req.body.fullName,
            bio: req.body.bio,
            expertise: req.body.expertise,
            experience: req.body.experience,
        };

        if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;

        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+password');

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ message: 'Current password incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        next(error);
    }
};
