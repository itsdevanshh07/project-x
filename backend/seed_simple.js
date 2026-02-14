const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');

dotenv.config();

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Just create courses without instructor for now if possible, or use a hardcoded ID if we know one
        // Wait, instructor is required. Let's find any user.
        const User = require('./src/models/User');
        const user = await User.findOne();
        if (!user) {
            console.error('No users found in database. Please run create_admin.js first or register a user.');
            process.exit(1);
        }

        await Course.deleteMany();
        await Course.create([
            {
                title: 'Advanced Thermodynamics',
                description: 'Master the laws of thermodynamics with conceptual clarity and numerical practice.',
                category: 'Physics',
                price: 4999,
                validity: 365,
                instructor: user._id,
                thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
                features: ['Live Sessions', 'Handwritten Notes', 'Practice Sets']
            }
        ]);

        console.log('Course Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedCourses();
