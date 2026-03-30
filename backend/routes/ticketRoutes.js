import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyTicket,
  updateTicketStatus,
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTicket).get(protect, admin, getAllTickets);
router.route('/my-tickets').get(protect, getMyTickets);
router.route('/:id/reply').post(protect, replyTicket);
router.route('/:id/status').put(protect, admin, updateTicketStatus);

export default router;
