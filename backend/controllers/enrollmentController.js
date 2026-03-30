import Enrollment from "../models/Enrollment.js";

// ✅ Enroll in course
export const enrollCourse = async (req, res) => {
  const { courseId } = req.body;

  const exists = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (exists) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  res.status(201).json(enrollment);
};

// ✅ Get my courses
export const getMyCourses = async (req, res) => {
  const courses = await Enrollment.find({ student: req.user._id })
    .populate("course");

  res.json(courses);
};

// ✅ Update progress
export const updateProgress = async (req, res) => {
  const { moduleIndex } = req.body;

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  // Avoid duplicate
  if (!enrollment.completedModules.includes(moduleIndex)) {
    enrollment.completedModules.push(moduleIndex);
  }

  // Calculate progress
  const totalModules = enrollment.course?.modules?.length || 1;
  enrollment.progress =
    (enrollment.completedModules.length / totalModules) * 100;

  await enrollment.save();

  res.json(enrollment);
};