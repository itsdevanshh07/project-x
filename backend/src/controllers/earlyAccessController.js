const EarlyAccess = require('../models/EarlyAccess');
const nodemailer = require('nodemailer');

// @desc    Submit Early Access Form
// @route   POST /api/early-access
// @access  Public
exports.submitEarlyAccess = async (req, res) => {
    try {
        const { studentName, studentClass, parentPhone, city } = req.body;

        if (!studentName || !studentClass || !parentPhone || !city) {
            return res.status(400).json({ success: false, message: 'Please provide all details.' });
        }

        // 1. Save to Database for Admin Panel
        const earlyAccessEntry = await EarlyAccess.create({
            studentName,
            studentClass,
            parentPhone,
            city
        });

        // 2. Send Email to Founder
        try {
            // Setup nodemailer transporter
            // Assuming environment variables are setup for email
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail'
                auth: {
                    user: process.env.EMAIL_USER || process.env.SMTP_USER,
                    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
                },
            });

            // Fallback for founder email if not in ENV
            const founderEmail = process.env.FOUNDER_EMAIL || process.env.ADMIN_EMAIL || 'founder@divyagyandhara.com';

            const mailOptions = {
                from: process.env.EMAIL_USER || process.env.SMTP_USER || 'noreply@divyagyandhara.com',
                to: founderEmail,
                subject: `New Early Access Registration: ${studentName}`,
                html: `
                    <h2>New Early Access Registration</h2>
                    <p>A new student has registered for early access. Here are the details:</p>
                    <ul>
                        <li><strong>Student Name:</strong> ${studentName}</li>
                        <li><strong>Class:</strong> ${studentClass}</li>
                        <li><strong>Parent Phone:</strong> ${parentPhone}</li>
                        <li><strong>City:</strong> ${city}</li>
                    </ul>
                    <p>Log in to the Admin Panel to see more details.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent to founder successfully.");
        } catch (emailError) {
            console.error("Error sending email to founder:", emailError);
            // We still return success: true because the DB save was successful, 
            // but we log the email failure.
        }

        res.status(201).json({
            success: true,
            message: 'Early access registration successful!',
            data: earlyAccessEntry
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all Early Access Registrations (For Admin)
// @route   GET /api/early-access
// @access  Private/Admin
exports.getEarlyAccessEntries = async (req, res) => {
    try {
        const entries = await EarlyAccess.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
