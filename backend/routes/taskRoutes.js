import express from 'express';
import {
  getMyTasks,
  createTask,
  submitTaskSolution,
  evaluateSubmission
} from '../controllers/taskController.js';

import { protect, mentor, student } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student
router.get('/my-tasks', protect, getMyTasks);
router.post('/:id/submit', protect, student, submitTaskSolution);

// Mentor
router.post('/', protect, mentor, createTask);
router.put('/:id/evaluate/:submissionId', protect, mentor, evaluateSubmission);

export default router;