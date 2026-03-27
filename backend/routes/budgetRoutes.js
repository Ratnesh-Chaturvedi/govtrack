import express from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  approveBudget,
  getBudgetStats,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBudgets);
router.get('/stats', getBudgetStats);
router.get('/:budgetId', getBudgetById);

// Protected routes
router.post('/', protect, createBudget);
router.patch('/:budgetId', protect, updateBudget);
router.post('/:budgetId/approve', protect, approveBudget);
router.delete('/:budgetId', protect, deleteBudget);

export default router;
