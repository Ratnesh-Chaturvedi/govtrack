import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/helpers.js';
import { uploadImageBuffer, uploadVideoBuffer, isCloudinaryConfigured } from '../utils/cloudinary.js';
import { getSocket } from '../utils/socket.js';

const mapPost = (post) => ({
  id: post._id,
  authorId: post.authorId,
  authorName: post.authorName,
  authorRole: post.authorRole,
  content: post.content,
  location: post.location,
  imageUrl: post.imageUrl,
  videoUrl: post.videoUrl,
  likes: post.likedBy?.length || 0,
  likedBy: post.likedBy || [],
  comments: (post.comments || []).map((c) => ({
    id: c._id,
    authorId: c.authorId,
    authorName: c.authorName,
    text: c.text,
    createdAt: c.createdAt,
  })),
  createdAt: post.createdAt,
});

export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(200);
    return sendResponse(res, 200, true, 'Community posts fetched', posts.map(mapPost));
  } catch (error) {
    console.error('Get community posts error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch posts');
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const { content, location } = req.body;
    if (!content) {
      return sendResponse(res, 400, false, 'Content is required');
    }

    let imageUrl = req.body.imageUrl;
    let videoUrl = req.body.videoUrl;
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendResponse(res, 500, false, 'Cloudinary is not configured. Please set CLOUDINARY_* env vars.');
      }
      const isVideo = req.file.mimetype?.startsWith('video/');
      const uploaded = isVideo
        ? await uploadVideoBuffer(req.file.buffer, 'civic/community')
        : await uploadImageBuffer(req.file.buffer, 'civic/community');
      if (isVideo) {
        videoUrl = uploaded?.secure_url || uploaded?.url;
      } else {
        imageUrl = uploaded?.secure_url || uploaded?.url;
      }
    }

    let authorName = req.body.authorName;
    if (!authorName && req.user?.userId) {
      const author = await User.findOne({ identificationId: req.user.userId }).select('fullName').lean();
      authorName = author?.fullName;
    }

    const post = await CommunityPost.create({
      authorId: req.user?.userId,
      authorName: authorName || 'Anonymous User',
      authorRole: req.user?.role || 'citizen',
      content,
      location: location || 'Local Area',
      imageUrl,
      videoUrl,
      likedBy: [],
      comments: [],
    });

    const payload = mapPost(post);
    try {
      getSocket().emit('community:postCreated', payload);
    } catch (socketError) {
      console.warn('Socket emit failed (postCreated):', socketError.message);
    }

    return sendResponse(res, 201, true, 'Post created', payload);
  } catch (error) {
    console.error('Create community post error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to create post');
  }
};

export const likeCommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    const alreadyLiked = post.likedBy.includes(userId);
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
    } else {
      post.likedBy.push(userId);
    }

    await post.save();
    const payload = mapPost(post);

    try {
      getSocket().emit('community:postLiked', payload);
    } catch (socketError) {
      console.warn('Socket emit failed (postLiked):', socketError.message);
    }

    return sendResponse(res, 200, true, 'Like updated', payload);
  } catch (error) {
    console.error('Like post error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to update like');
  }
};

export const commentCommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text) {
      return sendResponse(res, 400, false, 'Comment text is required');
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return sendResponse(res, 404, false, 'Post not found');
    }

    let authorName = req.user?.fullName;
    if (!authorName && req.user?.userId) {
      const author = await User.findOne({ identificationId: req.user.userId }).select('fullName').lean();
      authorName = author?.fullName;
    }

    post.comments.push({
      authorId: req.user?.userId,
      authorName: authorName || 'Anonymous User',
      text,
      createdAt: new Date(),
    });

    await post.save();
    const payload = mapPost(post);

    try {
      getSocket().emit('community:commentAdded', payload);
    } catch (socketError) {
      console.warn('Socket emit failed (commentAdded):', socketError.message);
    }

    return sendResponse(res, 200, true, 'Comment added', payload);
  } catch (error) {
    console.error('Comment post error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to add comment');
  }
};
