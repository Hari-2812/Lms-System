import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  applyLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', schema);
