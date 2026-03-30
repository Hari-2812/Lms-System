import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    feedback: String,
    score: Number,
    status: { type: String, enum: ['pending', 'evaluated'], default: 'pending' },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
