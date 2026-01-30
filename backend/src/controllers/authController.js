const User = require('../models/User');
const Course = require('../models/Course');
const generateToken = require('../utils/generateToken');
const { admin } = require('../config/firebase');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // --- HARDCODED ADMIN LOGIC ---
        const ADMIN_EMAIL = 'undhyani07@gmail.com';
        let userRole = role === 'teacher' ? 'teacher' : 'student';
        let userStatus = userRole === 'teacher' ? 'pending' : 'approved';

        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            userRole = 'admin';
            userStatus = 'approved';
        }

        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone,
            password,
            role: userRole,
            status: userStatus
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password, requiredRole } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // --- HARDCODED ADMIN LOGIC ---
            const ADMIN_EMAIL = 'undhyani07@gmail.com';
            if (user.email === ADMIN_EMAIL && user.role !== 'admin') {
                user.role = 'admin';
                user.status = 'approved';
                await user.save();
            }

            // Role Validation
            if (requiredRole) {
                if (requiredRole === 'admin' && user.role !== 'admin') {
                    return res.status(403).json({ message: 'Access Denied: Not an authorized Admin account.' });
                }

                if (requiredRole === 'teacher' && user.role !== 'teacher') {
                    return res.status(403).json({ message: 'Access Denied: Not a Teacher account.' });
                }

                if (requiredRole === 'student' && user.role !== 'student') {
                    return res.status(403).json({ message: 'Access Denied: Please sign in through the student portal.' });
                }
            }

            // Approval Validation for Teachers
            if (user.role === 'teacher' && user.status !== 'approved') {
                return res.status(403).json({
                    message: 'Your account is currently ' + user.status + '. Please wait for admin approval.',
                    status: user.status
                });
            }

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                enrolledCourses: user.enrolledCourses,
                purchasedTests: user.purchasedTests
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};
// @desc    Social Login (Google/Microsoft)
// @route   POST /api/auth/social
// @access  Public
exports.socialLogin = async (req, res, next) => {
    try {
        console.log(`Social Login attempt at: ${new Date().toISOString()}`);

        // 3. FIX 401 Invalid Token (VERIFY HEADER FORMAT)
        if (!req.headers.authorization?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format: No Bearer token provided" });
        }

        const idToken = req.headers.authorization.split(" ")[1];
        const { provider, requiredRole } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'ID Token is required' });
        }

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        // --- HARDCODED ADMIN LOGIC ---
        const ADMIN_EMAIL = 'undhyani07@gmail.com';
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // Find or create user
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create new user if they don't exist
            user = await User.create({
                fullName: name || email.split('@')[0],
                email: email.toLowerCase(),
                password: Math.random().toString(36).slice(-16), // Random password for social users
                avatar: picture,
                isSocial: true,
                socialProvider: provider,
                socialId: uid,
                role: isAdmin ? 'admin' : 'student',
                status: 'approved' // Social users (students/admins) are approved
            });
        } else if (isAdmin && user.role !== 'admin') {
            // Auto-promote if admin joins via social
            user.role = 'admin';
            user.status = 'approved';
            await user.save();
        }

        // Role Validation for Social Login
        if (requiredRole) {
            if (requiredRole === 'admin' && user.role !== 'admin') {
                return res.status(403).json({ message: 'Access Denied: Social account not linked to an Admin role.' });
            } else if (requiredRole === 'teacher' && user.role !== 'teacher') {
                return res.status(403).json({ message: 'Access Denied: Social account not linked to a Teacher role.' });
            }
        }

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            status: user.status,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Social Login Error Detail:', {
            tokenHeader: req.headers.authorization ? req.headers.authorization.substring(0, 30) + '...' : 'MISSING',
            errorName: error.name,
            errorMessage: error.message,
            errorCode: error.code
        });
        res.status(401).json({
            message: 'Authentication failed. Invalid token.',
            error: error.message
        });
    }
};
// @desc    Get All Teacher Requests (Pending)
// @route   GET /api/auth/teacher-requests
// @access  Private/Admin
exports.getTeacherRequests = async (req, res, next) => {
    try {
        const teachers = await User.find({ role: 'teacher', status: 'pending' });
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Teachers
// @route   GET /api/auth/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res, next) => {
    try {
        const teachers = await User.find({ role: 'teacher' });
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Public Teachers
// @route   GET /api/auth/teachers/public
// @access  Public
exports.getPublicTeachers = async (req, res, next) => {
    try {
        const teachers = await User.find({ role: 'teacher', status: 'approved' })
            .select('fullName email avatar bio expertise experience');

        const teachersWithCourses = await Promise.all(teachers.map(async (teacher) => {
            const courses = await Course.find({ instructor: teacher._id }).select('title category');
            return {
                ...teacher._doc,
                courses
            };
        }));

        res.json(teachersWithCourses);
    } catch (error) {
        next(error);
    }
};

// @desc    Approve/Reject Teacher
// @route   PUT /api/auth/approve-teacher/:id
// @access  Private/Admin
exports.updateTeacherStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const teacher = await User.findById(req.params.id);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        teacher.status = status;
        teacher.approvedBy = req.user._id;
        if (status === 'approved') {
            teacher.approvedAt = Date.now();
        }
        await teacher.save();

        res.json({ message: `Teacher status updated to ${status}`, teacher });
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Users (Students/Teachers/Admins)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Create an Admin account (Max 2 admins)
// @route   POST /api/auth/create-admin
// @access  Private/Admin
exports.createAdmin = async (req, res, next) => {
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount >= 2) {
            return res.status(400).json({ message: 'Maximum 2 admin accounts allowed' });
        }

        const { fullName, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const adminUser = await User.create({
            fullName,
            email,
            password,
            phone,
            role: 'admin',
            status: 'approved'
        });

        res.status(201).json({ message: 'Admin created successfully', adminUser });
    } catch (error) {
        next(error);
    }
};
