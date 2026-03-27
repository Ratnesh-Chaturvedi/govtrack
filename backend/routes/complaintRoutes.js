import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  upvoteComplaint,
  deleteComplaint,
  getComplaintStats,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getComplaints);
router.get('/stats', getComplaintStats);
router.get('/:complaintId', getComplaintById);

// Protected routes
router.post('/', protect, upload.single('image'), createComplaint);
router.patch('/:complaintId/status', protect, upload.single('image'), updateComplaintStatus);
router.post('/:complaintId/upvote', protect, upvoteComplaint);
router.delete('/:complaintId', protect, deleteComplaint);

export default router;
