import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: String,
  description: String,
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      file: String,
      grade: Number
    }
  ]
});

export default mongoose.model('Task', schema);