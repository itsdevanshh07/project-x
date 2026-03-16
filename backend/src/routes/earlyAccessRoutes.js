const express = require('express');
const { submitEarlyAccess, getEarlyAccessEntries } = require('../controllers/earlyAccessController');
const router = express.Router();

// The middleware for admin protection can be added to the GET route if available.
// For now making it available so it can be integrated easily.
// const { protect, authorize } = require('../middleware/auth'); 
// router.route('/').post(submitEarlyAccess).get(protect, authorize('admin', 'founder'), getEarlyAccessEntries);

router.route('/')
    .post(submitEarlyAccess)
    .get(getEarlyAccessEntries);

module.exports = router;
