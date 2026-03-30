import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  time: String,
  status: { type: String, default: 'pending' },
  meetLink: String
});

export default mongoose.model('Appointment', schema);