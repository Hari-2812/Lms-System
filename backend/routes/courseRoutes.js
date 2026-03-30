import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
} from "../controllers/courseController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all courses
router.get("/", getCourses);

// GET single course
router.get("/:id", getCourseById);

// CREATE course
router.post("/", protect, createCourse);

export default router;