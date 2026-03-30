import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    reply: String,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
