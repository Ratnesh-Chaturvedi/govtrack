import express from 'express';
import {
  getRTIRequests,
  getRTIRequestById,
  createRTIRequest,
  approveRTIRequest,
  getRTIStats,
  deleteRTIRequest,
} from '../controllers/rtiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRTIRequests);
router.get('/stats', getRTIStats);
router.get('/:rtiId', getRTIRequestById);

// Protected routes
router.post('/', protect, createRTIRequest);
router.patch('/:rtiId/approve', protect, approveRTIRequest);
router.delete('/:rtiId', protect, deleteRTIRequest);

export default router;
