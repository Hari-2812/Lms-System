import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    coverImage: String,
    price: { type: Number, default: 0 },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modules: [
      {
        title: String,
        duration: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);