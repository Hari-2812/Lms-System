import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  reply: String,
  status: { type: String, default: 'open' }
});

export default mongoose.model('Ticket', schema);