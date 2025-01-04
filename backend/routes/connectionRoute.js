const express = require('express');
const protectRoute = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/',protectRoute,getUserConnections);

module.exports = router;