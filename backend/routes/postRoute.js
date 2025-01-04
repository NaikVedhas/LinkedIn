const express = require('express');
const protectRoute = require('../middleware/authMiddleware');
const {getFeedPosts,createPost,deletePost, getPostById,createComment, likePost} = require('../controllers/postController');

const router = express.Router();


router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPost);
router.delete('/delete/:id',protectRoute,deletePost);
router.get('/:id',protectRoute,getPostById);
router.post('/:id/comment',protectRoute,createComment);
router.post('/:id/like',protectRoute,likePost);


module.exports = router;