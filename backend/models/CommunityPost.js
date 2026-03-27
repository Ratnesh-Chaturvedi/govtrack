import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  authorId: String,
  authorName: String,
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communityPostSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: 'Local Area',
  },
  imageUrl: String,
  videoUrl: String,
  likedBy: [String],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

communityPostSchema.index({ createdAt: -1 });

export default mongoose.model('CommunityPost', communityPostSchema);
