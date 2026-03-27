import express from 'express';
import { getContractors } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/contractors', protect, authorize('official'), getContractors);

export default router;
