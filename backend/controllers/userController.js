import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// 🔥 GET MENTORS
export const getMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: "mentor" }).select("name _id role email");

  res.json(mentors);
});
