const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const { getUserNotifications,markNotifiactionAsRead,deleteNotification } = require('../controllers/notificationController');

const router = express.Router();

router.get('/',protectRoute,getUserNotifications);
router.put('/:id/read',protectRoute,markNotifiactionAsRead);
router.delete('/:id',protectRoute,deleteNotification);


module.exports = router;