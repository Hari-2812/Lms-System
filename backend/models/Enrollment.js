import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completedModules: [
      {
        moduleIndex: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);