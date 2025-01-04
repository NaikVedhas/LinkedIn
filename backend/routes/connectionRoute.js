const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getUserConnections,
    getConnectionRequest,
    removeConnection,
    getConnectionStatus

} = require('../controllers/connectionController');

const router = express.Router();


router.get('/',protectRoute,getUserConnections);

router.post('/request/:id',protectRoute,sendConnectionRequest);
router.put('/accept/:requestId',protectRoute,acceptConnectionRequest);
router.put('/reject/:requestId',protectRoute,rejectConnectionRequest);
 
router.get('/requests',protectRoute,getConnectionRequest);
router.delete('/:id',protectRoute,removeConnection);
router.get('/status/:id',protectRoute,getConnectionStatus);


module.exports = router;