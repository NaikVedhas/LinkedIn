const {getSidebarUsers,getAllMessages} = require("../controllers/messageController");
const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/users",protectRoute,getSidebarUsers);
router.get("/:id",protectRoute,getAllMessages)

module.exports = router


