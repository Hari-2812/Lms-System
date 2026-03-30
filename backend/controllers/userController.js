import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// 🔥 GET MENTORS
export const getMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: { $in: ["mentor", "admin"] } }).select("name _id role");

  res.json(mentors);
});
