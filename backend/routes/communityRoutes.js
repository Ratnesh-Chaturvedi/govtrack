import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getCommunityPosts,
  createCommunityPost,
  likeCommunityPost,
  commentCommunityPost,
} from '../controllers/communityController.js';

const router = express.Router();

router.get('/posts', getCommunityPosts);
router.post('/posts', protect, upload.single('image'), createCommunityPost);
router.post('/posts/:postId/like', protect, likeCommunityPost);
router.post('/posts/:postId/comment', protect, commentCommunityPost);

export default router;

