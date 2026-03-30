import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

export const bookAppointment = asyncHandler(async (req, res) => {
  const { mentor, date, time } = req.body;

  if (!mentor || !date || !time) {
    res.status(400);
    throw new Error('mentor, date and time are required');
  }

  const appt = await Appointment.create({
    mentor,
    date,
    time,
    student: req.user._id,
  });

  res.status(201).json(appt);
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const query = req.user.role === 'mentor' ? { mentor: req.user._id } : { student: req.user._id };
  const data = await Appointment.find(query)
    .populate('student', 'name email')
    .populate('mentor', 'name email')
    .sort({ createdAt: -1 });

  res.json(data);
});

export const approveAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (!appt) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appt.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this appointment');
  }

  appt.status = req.body.status || 'approved';
  appt.meetLink = req.body.meetLink || appt.meetLink;
  await appt.save();

  res.json(appt);
});
