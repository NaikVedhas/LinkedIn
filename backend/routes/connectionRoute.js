const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getUserConnections,
    getConnectionRequest,
    removeConnection,
    getConnectionStatus,
    followUser,
    unFollowUser

} = require('../controllers/connectionController');

const router = express.Router();


router.get('/',protectRoute,getUserConnections);

router.post('/request/:id',protectRoute,sendConnectionRequest);
router.put('/accept/:requestId',protectRoute,acceptConnectionRequest);
router.put('/reject/:requestId',protectRoute,rejectConnectionRequest);
 
router.get('/requests',protectRoute,getConnectionRequest);
router.get('/status/:id',protectRoute,getConnectionStatus);
router.post('/follow/:id',protectRoute,followUser);
router.post('/unfollow/:id',protectRoute,unFollowUser);
router.delete('/:id',protectRoute,removeConnection);

module.exports = router;