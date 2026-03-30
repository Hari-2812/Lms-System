import Course from "../models/Course.js";

// ✅ Get all courses
export const getCourses = async (req, res) => {
  const courses = await Course.find().populate("instructor", "name");
  res.json(courses);
};

// ✅ Get single course (IMPORTANT FOR YOUR PAGE)
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "instructor",
    "name"
  );

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
};

// ✅ Create course (optional admin)
export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};