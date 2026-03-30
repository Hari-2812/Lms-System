import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  const appt = await Appointment.create({
    ...req.body,
    student: req.user._id
  });
  res.json(appt);
};

export const getMyAppointments = async (req, res) => {
  const data = await Appointment.find({ student: req.user._id });
  res.json(data);
};

export const approveAppointment = async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  appt.status = 'approved';
  appt.meetLink = req.body.meetLink;
  await appt.save();
  res.json(appt);
};