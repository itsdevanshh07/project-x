require('dotenv').config();
const fs = require('fs');
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
console.log('Length:', sa ? sa.length : 0);
if (sa) {
    console.log('Start:', sa.substring(0, 50));
    console.log('End:', sa.substring(sa.length - 50));
    try {
        JSON.parse(sa);
        console.log('Successfully parsed!');
    } catch (e) {
        console.error('Parse Error:', e.message);
        console.log('Error at:', sa.substring(e.message.match(/at position (\d+)/)[1] - 20, e.message.match(/at position (\d+)/)[1] + 20));
    }
} else {
    console.log('FIREBASE_SERVICE_ACCOUNT is empty');
}
