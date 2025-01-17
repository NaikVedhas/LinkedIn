const express = require('express');
const { signup1,signup2,login,logout,getCurrentUser } = require('../controllers/authController')
const protectRoute = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/signup1',signup1);
router.post('/signup2',signup2);
router.post('/login',login);
router.post('/logout',logout);

router.get('/me',protectRoute,getCurrentUser);

module.exports = router;

