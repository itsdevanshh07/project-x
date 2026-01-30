const admin = require('firebase-admin');

const initializeFirebase = () => {
    if (!admin.apps.length) {
        try {
            // Prefer environment variables for production-grade security
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                let serviceAccount;
                const saValue = process.env.FIREBASE_SERVICE_ACCOUNT;

                if (saValue.endsWith('.json')) {
                    // It's a file path
                    const fs = require('fs');
                    const path = require('path');
                    const saPath = path.isAbsolute(saValue)
                        ? saValue
                        : path.join(__dirname, '../../', saValue);

                    serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
                } else {
                    // It's a raw JSON string
                    let serviceAccountStr = saValue;
                    if (serviceAccountStr.startsWith("'") && serviceAccountStr.endsWith("'")) {
                        serviceAccountStr = serviceAccountStr.slice(1, -1);
                    }
                    serviceAccount = JSON.parse(serviceAccountStr);
                }

                // Fix for private_key newlines
                if (serviceAccount.private_key) {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('Firebase Admin SDK Initialized successfully');
            } else {
                console.warn('FIREBASE_SERVICE_ACCOUNT not found in environment variables');
            }
        } catch (error) {
            console.error('Firebase Admin Initialization Error:', error);
        }
    }
};

module.exports = { admin, initializeFirebase };
