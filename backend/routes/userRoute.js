const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const { getPublicProfile,getSuggestedConnections } = require('../controllers/userController');

const router = express.Router();

router.get("/suggestions",protectRoute,getSuggestedConnections);    //whichever route we wanna protect we add this protectRoute there

router.get("/:username",protectRoute,getPublicProfile);


module.exports = router;