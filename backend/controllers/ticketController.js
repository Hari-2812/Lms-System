import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
  const ticket = await Ticket.create({
    student: req.user._id,
    question: req.body.question
  });
  res.json(ticket);
};

export const getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ student: req.user._id });
  res.json(tickets);
};

export const replyTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  ticket.reply = req.body.reply;
  ticket.status = 'closed';
  await ticket.save();
  res.json(ticket);
};