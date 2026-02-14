const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const User = require('./src/models/User');

dotenv.config();

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for course seeding...');

        // Find or create a teacher/admin user to be the instructor
        let instructor = await User.findOne({ role: { $in: ['teacher', 'admin'] } });

        if (!instructor) {
            console.log('No teacher/admin found, creating a demo one...');
            instructor = await User.create({
                fullName: 'Demo Instructor',
                email: 'instructor@demo.com',
                password: 'password123',
                role: 'teacher',
                status: 'approved'
            });
        }

        // Clear existing courses
        await Course.deleteMany();

        await Course.create([
            {
                title: 'Advanced Thermodynamics',
                description: 'Master the laws of thermodynamics with conceptual clarity and numerical practice.',
                category: 'Physics',
                price: 4999,
                validity: 365,
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                features: ['Live Sessions', 'Handwritten Notes', 'Practice Sets']
            },
            {
                title: 'Pure Mathematics: Calculus',
                description: 'From limits to integration, understand the language of change with visual proofs.',
                category: 'Mathematics',
                price: 3999,
                validity: 365,
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
                features: ['Video Lectures', 'Doubt Clearing', 'Weekly Tests']
            }
        ]);

        console.log('Courses Seeded Successfully!');
        process.exit();
    } catch (error) {
        if (error.name === 'ValidationError') {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error on ${key}: ${error.errors[key].message}`);
            });
        } else {
            console.error('Error seeding courses:', error);
        }
        process.exit(1);
    }
};

seedCourses();
