import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: String,
  company: String,
  link: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', schema);