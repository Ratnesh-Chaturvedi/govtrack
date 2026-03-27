import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  addCitizenFeedback,
  deleteProject,
  getDashboardStats,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/stats', getDashboardStats);
router.get('/:projectId', getProjectById);

// Protected routes
router.post('/', protect, createProject);
router.patch('/:projectId', protect, updateProject);
router.patch('/:projectId/status', protect, upload.single('proof'), updateProjectStatus);
router.post('/:projectId/feedback', protect, addCitizenFeedback);
router.delete('/:projectId', protect, deleteProject);

export default router;
