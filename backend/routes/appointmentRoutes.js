import express from 'express';
import { protect, mentor } from '../middleware/authMiddleware.js';
import {
  bookAppointment,
  getMyAppointments,
  approveAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/:id/approve', protect, mentor, approveAppointment);

export default router;