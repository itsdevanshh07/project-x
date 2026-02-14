const admin = require('firebase-admin');

const initializeFirebase = () => {
    if (!admin.apps.length) {
        try {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                let serviceAccount;
                const saValue = process.env.FIREBASE_SERVICE_ACCOUNT.trim();

                // 1. Try to parse as direct JSON string first (Best for Cloud/Render)
                if (saValue.startsWith('{')) {
                    try {
                        serviceAccount = JSON.parse(saValue);
                    } catch (e) {
                        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT as JSON string:', e.message);
                    }
                }

                // 2. Fallback: If not JSON or parsing failed, try as a file path
                if (!serviceAccount && saValue.endsWith('.json')) {
                    const fs = require('fs');
                    const path = require('path');
                    const saPath = path.isAbsolute(saValue)
                        ? saValue
                        : path.join(__dirname, '../../', saValue);

                    if (fs.existsSync(saPath)) {
                        serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
                    } else {
                        console.error(`Firebase Service Account file not found at: ${saPath}`);
                    }
                }

                if (serviceAccount) {
                    // Fix for private_key newlines if they are escaped as strings
                    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
                        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                    }

                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                    console.log('✅ Firebase Admin SDK Initialized successfully');
                } else {
                    console.error('❌ Could not initialize Firebase: No valid credentials found.');
                }
            } else {
                console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT not found in environment variables');
            }
        } catch (error) {
            console.error('🔥 Critical Firebase Admin Initialization Error:', error.message);
        }
    }
};

module.exports = { admin, initializeFirebase };
