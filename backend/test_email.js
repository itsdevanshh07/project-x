require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    try {
        console.log("Testing with:");
        console.log("User:", process.env.EMAIL_USER);
        console.log("Pass:", process.env.EMAIL_PASS ? "****" : "missing");

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.FOUNDER_EMAIL || process.env.EMAIL_USER,
            subject: "Test Email Node.js",
            text: "This is a test email to verify credentials.",
        });

        console.log("Email sent successfully: ", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

testEmail();
