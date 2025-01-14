const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const { getPublicProfile,getSuggestedConnections,updateProfile,getProfileViewers,getMyActivityProfileViewers, getSearchedUsers } = require('../controllers/userController');

const router = express.Router();

router.get("/suggestions",protectRoute,getSuggestedConnections);    //whichever route we wanna protect we add this protectRoute there
router.get("/profileViewers",protectRoute,getProfileViewers);
router.put("/profile",protectRoute,updateProfile);
router.get("/myActivity/profileViewers",protectRoute,getMyActivityProfileViewers)
router.post('/searchUser',protectRoute,getSearchedUsers);
router.get("/:username",protectRoute,getPublicProfile);

module.exports = router;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzc3ZjQ5ZWNmMDRkYTU5NWJmZTI1MDQiLCJpYXQiOjE3MzU5MTQ2NTQsImV4cCI6MTczNjE3Mzg1NH0.lb8E8ZVdKfCySUCxQFKPVtQJv_NuAPUjBBrd-owYLZc  of M 


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzc3YzgxNWY0ZDY4OTZlODdkYTRhM2MiLCJpYXQiOjE3MzU5MTQ4MjUsImV4cCI6MTczNjE3NDAyNX0.f43FTuQ00EHx7sZ34B8_frRvY4VlAJLfC9uB_oYmTRM      of MrNaik