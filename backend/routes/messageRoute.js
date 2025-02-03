const {getSidebarUsers,getAllMessages,sendMessages} = require("../controllers/messageController");
const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/users",protectRoute,getSidebarUsers);
router.get("/:id",protectRoute,getAllMessages)
router.post("/send/:id",protectRoute,sendMessages);

module.exports = router


