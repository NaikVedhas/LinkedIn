const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getUserConnections,

} = require('../controllers/connectionController');

const router = express.Router();


router.get('/',protectRoute,getUserConnections);

router.post('/request/:id',protectRoute,sendConnectionRequest);
router.put('/accept/:requestId',protectRoute,acceptConnectionRequest);
router.put('/reject/:requestId',protectRoute,rejectConnectionRequest);





module.exports = router;