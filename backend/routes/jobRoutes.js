import express from 'express';
import {
  createJob,
  getJobs,
} from '../controllers/jobController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, admin, createJob);

export default router;
