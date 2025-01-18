const express = require('express');
const { signup1,signup2,login,logout,getCurrentUser,reSendOtp } = require('../controllers/authController')
const protectRoute = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/signup1',signup1);
router.post('/signup2',signup2);
router.post('/login',login);
router.post('/logout',logout);
router.post('/signup2/resendotp',reSendOtp);

router.get('/me',protectRoute,getCurrentUser);

module.exports = router;

