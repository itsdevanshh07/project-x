const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@divyagyandhara.com';
        const adminPassword = 'adminpassword123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit();
        }

        const admin = await User.create({
            fullName: 'Platform Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            status: 'approved'
        });

        console.log('-----------------------------------');
        console.log('Admin User Created Successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
