import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: String,
    videoUrl: String,
  },
  { _id: false }
);

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    coverImage: String,
    price: { type: Number, default: 0 },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
