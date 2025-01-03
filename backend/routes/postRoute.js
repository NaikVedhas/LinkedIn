const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const {getFeedPosts,createPost,deletePost} = require('../controllers/postController');

const router = express.Router();


router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPost);
router.delete('/delete/:id',protectRoute,deletePost);


module.exports = router;