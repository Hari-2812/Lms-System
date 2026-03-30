import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';

export const getCourses = asyncHandler(async (_req, res) => {
  const courses = await Course.find()
    .select('title description videoUrl coverImage price instructor modules.title modules.duration')
    .populate('instructor', 'name')
    .lean();
  res.json(courses);
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json(course);
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, instructor: req.user._id });
  res.status(201).json(course);
});
