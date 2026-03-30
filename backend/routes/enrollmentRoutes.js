import express from "express";
import {
  enrollCourse,
  getMyCourses,
  updateProgress,
} from "../controllers/enrollmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, enrollCourse);
router.get("/my", protect, getMyCourses);
router.put("/:id", protect, updateProgress);

export default router;