import asyncHandler from 'express-async-handler';
import Ticket from '../models/Ticket.js';

export const createTicket = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Question is required');
  }

  const ticket = await Ticket.create({
    student: req.user._id,
    question,
  });

  res.status(201).json(ticket);
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

export const getAllTickets = asyncHandler(async (_req, res) => {
  const tickets = await Ticket.find()
    .populate('student', 'name email')
    .populate('repliedBy', 'name role')
    .sort({ createdAt: -1 });
  res.json(tickets);
});

export const replyTicket = asyncHandler(async (req, res) => {
  const { reply } = req.body;

  if (!reply) {
    res.status(400);
    throw new Error('Reply is required');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role === 'student' && ticket.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to reply this ticket');
  }

  ticket.reply = reply;
  ticket.status = 'closed';
  ticket.repliedBy = req.user._id;
  await ticket.save();

  res.json(ticket);
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  ticket.status = status || ticket.status;
  await ticket.save();

  res.json(ticket);
});
