import asyncHandler from 'express-async-handler';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error('courseId is required');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const exists = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (exists) {
    res.status(400);
    throw new Error('Already enrolled');
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  res.status(201).json(enrollment);
});

export const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Enrollment.find({ student: req.user._id }).populate('course');
  res.json(courses);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { moduleIndex } = req.body;

  const enrollment = await Enrollment.findById(req.params.id).populate('course');

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  if (enrollment.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this enrollment');
  }

  const hasModule = enrollment.completedModules.some((item) => item.moduleIndex === moduleIndex);
  if (!hasModule) {
    enrollment.completedModules.push({ moduleIndex });
  }

  const totalModules = enrollment.course?.modules?.length || 1;
  enrollment.progress = (enrollment.completedModules.length / totalModules) * 100;

  await enrollment.save();
  res.json(enrollment);
});
