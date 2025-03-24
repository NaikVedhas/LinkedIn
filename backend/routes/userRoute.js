const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const { getPublicProfile,getSuggestedConnections,updateProfile,getProfileViewers,getMyActivityProfileViewers, getSearchedUsers } = require('../controllers/userController');

const router = express.Router();

router.get("/suggestions",protectRoute,getSuggestedConnections);    
router.get("/profileViewers",protectRoute,getProfileViewers);
router.put("/profile",protectRoute,updateProfile);
router.get("/myActivity/profileViewers",protectRoute,getMyActivityProfileViewers)
router.post('/searchUser',protectRoute,getSearchedUsers);
router.get("/:username",protectRoute,getPublicProfile);

module.exports = router;

