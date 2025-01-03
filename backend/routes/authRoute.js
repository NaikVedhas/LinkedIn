const express = require('express');
const { signup,login,logout,getCurrentUser } = require('../controllers/authController')
const protectRoute = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

router.get('/me',protectRoute,getCurrentUser);

module.exports = router;

