const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('instructor', 'fullName avatar');
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course with modules and lessons
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'fullName avatar bio')
            .lean();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch modules and lessons
        const modules = await Module.find({ course: req.params.id }).sort('order').lean();

        for (let i = 0; i < modules.length; i++) {
            modules[i].lessons = await Lesson.find({ module: modules[i]._id }).sort('order').lean();
        }

        course.modules = modules;
        res.json(course);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
exports.createCourse = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            price,
            discountedPrice,
            validity,
            features,
            thumbnail
        } = req.body;

        const course = new Course({
            title,
            description,
            category,
            price,
            discountedPrice,
            validity,
            features,
            instructor: req.user._id,
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(updatedCourse);
    } catch (error) {
        next(error);
    }
};

// --- MODULES ---

exports.createModule = async (req, res, next) => {
    try {
        const { title, courseId, order } = req.body;
        const module = await Module.create({
            title,
            course: courseId,
            order
        });
        res.status(201).json(module);
    } catch (error) {
        next(error);
    }
};

exports.getModulesByCourse = async (req, res, next) => {
    try {
        const modules = await Module.find({ course: req.params.courseId }).sort('order');
        res.json(modules);
    } catch (error) {
        next(error);
    }
};

exports.updateModule = async (req, res, next) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!module) return res.status(404).json({ message: 'Module not found' });
        res.json(module);
    } catch (error) {
        next(error);
    }
};

exports.deleteModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: 'Module not found' });
        await module.remove();
        res.json({ message: 'Module removed' });
    } catch (error) {
        next(error);
    }
};

// --- LESSONS ---

exports.createLesson = async (req, res, next) => {
    try {
        const { title, moduleId, courseId, videoUrl, pdfUrl, duration, order, isFree } = req.body;
        const lesson = await Lesson.create({
            title,
            module: moduleId,
            course: courseId,
            videoUrl,
            pdfUrl,
            duration,
            order,
            isFree
        });
        res.status(201).json(lesson);
    } catch (error) {
        next(error);
    }
};

exports.getLessonsByModule = async (req, res, next) => {
    try {
        const lessons = await Lesson.find({ module: req.params.moduleId }).sort('order');
        res.json(lessons);
    } catch (error) {
        next(error);
    }
};

exports.updateLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        next(error);
    }
};

exports.deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        await lesson.remove();
        res.json({ message: 'Lesson removed' });
    } catch (error) {
        next(error);
    }
};
