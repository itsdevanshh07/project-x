require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./src/config/db');
const { initializeFirebase } = require('./src/config/firebase');

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());

// Standard Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
        const isAllowed = allowedOrigins.includes(origin) || isLocalhost;

        // In development, allow all origins
        if (process.env.NODE_ENV === 'development' || isAllowed) {
            callback(null, true);
        } else {
            console.warn(`Origin ${origin} not allowed by CORS`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// COOP Fix for Social Login
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Academy API is running...' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));
app.use('/api/mux', require('./src/routes/muxRoutes'));
app.use('/api/student', require('./src/routes/studentRoutes'));
app.use('/api/teacher', require('./src/routes/teacherRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/test-series', require('./src/routes/testSeriesRoutes'));
app.use('/api/pyq', require('./src/routes/pyqRoutes'));
app.use('/api/current-affairs', require('./src/routes/currentAffairsRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`Error [${req.method}] ${req.path}: ${err.message}`);
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});



const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        // Initialize Firebase Admin
        initializeFirebase();

        const PORT = process.env.PORT || 5000;
        const server = require('http').createServer(app);
        const io = require('socket.io')(server, {
            cors: {
                origin: allowedOrigins,
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        // Socket logic integration
        require('./src/config/socket')(io);

        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}`);
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err);
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use.`);
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
